/*******************************************************************************************************************************
 * AK.FinanceManager.Services.BudgetService
 * Copyright © 2013 Aashish Koirala <http://aashishkoirala.github.io>
 * 
 * This file is part of Finance Manager.
 *  
 * Finance Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Finance Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Finance Manager.  If not, see <http://www.gnu.org/licenses/>.
 * 
 *******************************************************************************************************************************/

#region Namespace Imports

using AK.Commons;
using AK.Commons.DataAccess;
using AK.Commons.Exceptions;
using AK.Commons.Logging;
using AK.FinanceManager.Contracts.DataAccess.Repositories;
using AK.FinanceManager.Contracts.Services;
using AK.FinanceManager.Contracts.Services.Data.BudgetContracts;
using AK.FinanceManager.Contracts.Services.Operation;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Diagnostics;
using System.Linq;
using Entities = AK.FinanceManager.Contracts.DataAccess.Entities;

#endregion

namespace AK.FinanceManager.Services
{
    /// <summary>
    /// Service implementation - see IBudgetService.
    /// </summary>
    /// <see cref="IBudgetService"/>
    /// <author>Aashish Koirala</author>
    [Export(typeof (IBudgetService)), PartCreationPolicy(CreationPolicy.Shared)]
    public class BudgetService : IBudgetService
    {
        #region Fields

        [Import] private IAppLogger logger;
        [Import] private IAuthorizationService authorizationService;
        [Import] private IAppDataAccess appDataAccess;
        [Import] private IBudgetRepository budgetRepository;
        [Import] private IBudgetHeadingRepository budgetHeadingRepository;
        [Import] private IBudgetItemRepository budgetItemRepository;
        [Import] private IFinanceTransactionRepository financeTransactionRepository;

        #endregion

        #region Properties

        private IUnitOfWorkFactory Database { get { return appDataAccess["FinanceManager"]; } }

        #endregion

        #region Methods (Public - IBudgetService)

        public IList<BudgetListItem> GetBudgetList(string userName, int workbookId)
        {
            this.logger.Verbose(string.Format("Retrieving budget list for user {0} and workbook {1}...", userName, workbookId));

            this.authorizationService.Authorize(userName, workbookId);

            IList<BudgetListItem> list = null;

            try
            {
                this.Database.With(this.budgetRepository).Execute(unit =>
                {
                    list = this.budgetRepository
                        .GetList(q => q.Where(x => x.Workbook.Id == workbookId).ToList())
                        .ToDc();
                });
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(ServiceErrorCodes.GetBudgetListError);
            }

            return list;
        }

        public Budget GetBudget(string userName, int id)
        {
            this.logger.Verbose(string.Format("Retrieving budget {0} for user {1}...", id, userName));

            Entities.Budget budgetEntity = null;
            IDictionary<int, decimal> actualAmountDictionary = null;

            try
            {
                this.Database.With(
                    this.budgetRepository,
                    this.budgetItemRepository,
                    this.financeTransactionRepository).Execute(
                        unit =>
                        {
                            budgetEntity = this.budgetRepository.Get(id);
                            budgetEntity.BudgetItemList = this.budgetItemRepository
                                .GetList(q => q.Where(x => x.Budget.Id == id).ToList())
                                .ToList();

                            // Actual amounts are calculated on the fly from transactions within the
                            // same workbook that fall within the budget period. Each transaction has
                            // a budget heading.
                            //
                            actualAmountDictionary = this.financeTransactionRepository
                                .GetFor<IDictionary<int, decimal>>(
                                    q => q
                                             .Where(x => x.Workbook.Id == budgetEntity.Workbook.Id &&
                                                         x.TransactionDate >= budgetEntity.PeriodStartDate &&
                                                         x.TransactionDate <= budgetEntity.PeriodEndDate)
                                             .Select(x => new {x.BudgetHeading.Id, x.Amount})
                                             .ToList()
                                             .GroupBy(x => x.Id)
                                             .ToDictionary(x => x.Key, x => x.Select(y => y.Amount).Sum()));

                        });
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(ServiceErrorCodes.GetBudgetError);
            }

            Debug.Assert(budgetEntity != null);
            this.authorizationService.Authorize(userName, budgetEntity.Workbook.Id);

            return budgetEntity.ToDc(actualAmountDictionary);
        }

        public Budget UpdateBudget(string userName, Budget budget)
        {
            this.logger.Verbose(string.Format("Updating budget {0} for user {1}...", budget.Id, userName));

            this.authorizationService.Authorize(userName, budget.WorkbookId);

            try
            {
                IDictionary<int, Entities.BudgetItem> budgetItemEntityDictionary = null;

                this.Database.With(this.budgetItemRepository).Execute(unit =>
                {
                    budgetItemEntityDictionary = this.budgetItemRepository
                        .GetList(q => q.Where(x => x.Budget.Id == budget.Id).ToList())
                        .ToDictionary(x => x.Id, x => x);
                });

                // We just update amounts on an existing budget.
                //
                foreach (var budgetItem in budget.BudgetItemList)
                {
                    Entities.BudgetItem budgetItemEntity;
                    if (!budgetItemEntityDictionary.TryGetValue(budgetItem.Id, out budgetItemEntity))
                        continue;
                    budgetItemEntity.Amount = budgetItem.BudgetAmount;
                }

                var budgetItemList = budgetItemEntityDictionary.Values.ToList();

                this.Database
                    .With(this.budgetItemRepository)
                    .Execute(unit => budgetItemList.ForEach(this.budgetItemRepository.Save));
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(ServiceErrorCodes.UpdateBudgetError);
            }

            return this.GetBudget(userName, budget.Id);
        }

        public Budget CreateBudget(string userName, int workbookId, 
            DateTime periodStartDate, DateTime periodEndDate)
        {
            this.logger.Verbose(string.Format(
                "Creating new budget in workbook {0} for user {1} with period start date {2} and period end date {3}...",
                workbookId, userName, periodStartDate, periodEndDate));

            this.authorizationService.Authorize(userName, workbookId);

            if (periodEndDate <= periodStartDate)
                throw new ServiceException(ServiceErrorCodes.CreateBudgetInvalidPeriodStartDate);

            var budgetId = 0;

            try
            {
                var overlap = false;

                this.Database.With(
                    this.budgetRepository,
                    this.budgetItemRepository,
                    this.budgetHeadingRepository,
                    this.financeTransactionRepository).Execute(unit =>
                    {
                        // Check for overlap - i.e. make sure that the budget creation
                        // dates are most recent and don't run into any past budgets.

                        overlap = this.budgetRepository.GetFor(
                            q =>
                            q.Any(x => x.Workbook.Id == workbookId &&
                                       (x.PeriodStartDate >= periodStartDate ||
                                        x.PeriodEndDate >= periodStartDate)));

                        if (!overlap)
                            overlap = this.budgetRepository.GetFor(
                                q =>
                                q.Any(x => x.Workbook.Id == workbookId &&
                                           (x.PeriodStartDate >= periodEndDate ||
                                            x.PeriodEndDate >= periodEndDate)));

                        if (overlap) return;

                        var previousBudgetList =
                            this.budgetRepository.GetList(q => q.Where(x => x.Workbook.Id == workbookId));

                        var previousBudget = previousBudgetList
                            .OrderByDescending(x => x.PeriodEndDate)
                            .ThenByDescending(x => x.PeriodStartDate)
                            .FirstOrDefault();

                        // Use the existing budget to create the new budget.
                        //
                        var newBudget = this.CloneBudget(previousBudget, workbookId, periodStartDate, periodEndDate);

                        this.budgetRepository.Save(newBudget);
                        foreach (var budgetItem in newBudget.BudgetItemList)
                        {
                            budgetItem.Budget = new Entities.Budget {Id = newBudget.Id};
                            this.budgetItemRepository.Save(budgetItem);
                        }

                        budgetId = newBudget.Id;
                    });

                if (overlap) throw new ServiceException(ServiceErrorCodes.CreateBudgetOverlappingDates);
            }
            catch (ServiceException)
            {
                throw;
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(ServiceErrorCodes.CreateBudgetError);
            }

            return this.GetBudget(userName, budgetId);
        }

        #endregion

        #region Methods (Private)

        private Entities.Budget CloneBudget(Entities.Budget source, int workbookId, 
            DateTime periodStartDate, DateTime periodEndDate)
        {
            // If there is no old budget (i.e. this is the first one we're creating),
            // then there's nothing to clone - create a new one.
            //
            if (source == null) return this.CreateNewBudget(workbookId, periodStartDate, periodEndDate);

            source.BudgetItemList = this.budgetItemRepository
                .GetList(q => q.Where(x => x.Budget.Id == source.Id))
                .ToList();

            // Generate actual amounts for the old budget - because we'll use those to
            // populate the budgeted amounts for the new budget.
            //
            var actualAmountDictionary = this.financeTransactionRepository
                .GetFor<IDictionary<int, decimal>>(
                    q => q
                             .Where(x => x.Workbook.Id == source.Workbook.Id &&
                                         x.TransactionDate >= source.PeriodStartDate &&
                                         x.TransactionDate <= source.PeriodEndDate)
                             .Select(x => new { x.BudgetHeading.Id, x.Amount })
                             .ToList()
                             .GroupBy(x => x.Id)
                             .ToDictionary(x => x.Key, x => x.Select(y => y.Amount).Sum()));

            var budget = new Entities.Budget
            {
                Workbook = source.Workbook,
                PeriodStartDate = periodStartDate,
                PeriodEndDate = periodEndDate,
                BudgetItemList = source.BudgetItemList
                    .Select(x => new Entities.BudgetItem
                    {
                        BudgetHeading = x.BudgetHeading,
                        Amount =
                            actualAmountDictionary.ContainsKey(x.BudgetHeading.Id)
                                ? actualAmountDictionary[x.BudgetHeading.Id]
                                : 0
                    })
                    .ToList()
            };

            HandleAnnualizedAndSurplus(source, budget, actualAmountDictionary);

            return budget;
        }

        private Entities.Budget CreateNewBudget(int workbookId, DateTime periodStartDate, DateTime periodEndDate)
        {
            // A new budget will contain one item for every heading.

            var budgetHeadingList =
                this.budgetHeadingRepository.GetList(q => q.Where(x => x.BudgetHeadingType.Workbook.Id == workbookId));

            return new Entities.Budget
            {
                Workbook = new Entities.Workbook {Id = workbookId},
                PeriodStartDate = periodStartDate,
                PeriodEndDate = periodEndDate,
                BudgetItemList = budgetHeadingList
                    .Select(x => new Entities.BudgetItem { BudgetHeading = x, Amount = 0 })
                    .ToList()
            };
        }

        private static void HandleAnnualizedAndSurplus(Entities.Budget oldBudget, Entities.Budget newBudget, 
            IDictionary<int, decimal> actualAmountDictionary)
        {
            // Annualized headings and surplus/deficit items need special care.
            // Surplus/deficit on annualized headings don't contribute to the overall surplus, they
            // are handled individually.

            var oldAnnualizedItems = oldBudget.BudgetItemList.Where(x => x.BudgetHeading.IsAnnualized);

            decimal overallSurplusToSubtract = 0;

            foreach (var oldAnnualizedItem in oldAnnualizedItems)
            {
                var actualAmount = actualAmountDictionary.ContainsKey(oldAnnualizedItem.BudgetHeading.Id)
                                       ? actualAmountDictionary[oldAnnualizedItem.BudgetHeading.Id]
                                       : 0;

                var surplus = oldAnnualizedItem.Amount - actualAmount;
                
                var newAnnualizedItem = newBudget.BudgetItemList.FirstOrDefault(
                        x => x.BudgetHeading.Id == oldAnnualizedItem.BudgetHeading.Id);

                if (newAnnualizedItem == null) continue;

                newAnnualizedItem.Amount += surplus;
                overallSurplusToSubtract += surplus;
            }

            var oldEndingSurplus = oldBudget.BudgetItemList
                .Where(x => x.BudgetHeading.IsEndingSurplus)
                .Select(x => x.Amount)
                .Sum();

            oldEndingSurplus -= overallSurplusToSubtract;

            var newBeginningSurplusItem =
                newBudget.BudgetItemList.FirstOrDefault(x => x.BudgetHeading.IsBeginningSurplus);

            if (newBeginningSurplusItem != null) newBeginningSurplusItem.Amount = oldEndingSurplus;

            newBudget.BudgetItemList
                .Where(x => x.BudgetHeading.IsEndingSurplus)
                .ForEach(x => x.Amount = 0);
        }

        #endregion
    }
}