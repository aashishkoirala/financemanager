/*******************************************************************************************************************************
 * AK.FinanceManager.Services.FinanceTransactionService
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
using AK.FinanceManager.Contracts.Services.Data.FinanceTransactionContracts;
using AK.FinanceManager.Contracts.Services.Operation;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using Entities = AK.FinanceManager.Contracts.DataAccess.Entities;

#endregion

namespace AK.FinanceManager.Services
{
    /// <summary>
    /// Service implementation - see IFinanceTransactionService.
    /// </summary>
    /// <see cref="IFinanceTransactionService"/>
    /// <author>Aashish Koirala</author>
    [Export(typeof (IFinanceTransactionService)), PartCreationPolicy(CreationPolicy.Shared)]    
    public class FinanceTransactionService : IFinanceTransactionService
    {
        #region Fields

        [Import] private IAppLogger logger;
        [Import] private IAuthorizationService authorizationService;
        [Import] private IAppDataAccess appDataAccess;
        [Import] private IFinanceTransactionRepository financeTransactionRepository;
        [Import] private IVendorMappingRepository vendorMappingRepository;
        [Import] private IVendorBudgetHeadingRepository vendorBudgetHeadingRepository;
        [Import] private IBudgetHeadingRepository budgetHeadingRepository;

        #endregion

        #region Properties

        private IUnitOfWorkFactory Database { get { return appDataAccess["FinanceManager"]; }}

        #endregion

        #region Methods (Public - IFinanceTransactionService)

        public FinanceTransactionSetLookup GetFinanceTransactionSetLookup(string userName, int workbookId)
        {
            this.logger.Verbose(string.Format(
                "Getting transaction lookup data for workbook {0} for user {1}...", workbookId, userName));

            this.authorizationService.Authorize(userName, workbookId);

            IEnumerable<Entities.Vendor> vendorEntityList = null;
            IEnumerable<Entities.BudgetHeadingType> budgetHeadingTypeEntityList = null;

            try
            {
                this.Database.With(
                    this.financeTransactionRepository,
                    this.vendorMappingRepository,
                    this.budgetHeadingRepository,
                    this.vendorBudgetHeadingRepository).Execute(
                        unit =>
                        this.GetFinanceTransactionSetLookupData(
                            workbookId,
                            out vendorEntityList,
                            out budgetHeadingTypeEntityList));
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(
                    ServiceErrorCodes.GetFinanceTransactionSetLookupError);
            }

            var vendorList = vendorEntityList.ToDc();
            var budgetHeadingTypeList = budgetHeadingTypeEntityList.ToDc();

            var defaultTransactionToDate = DateTime.Today;
            var defaultTransactionFromDate = new DateTime(
                defaultTransactionToDate.Year, defaultTransactionToDate.Month, 1);

            return new FinanceTransactionSetLookup
            {
                WorkbookId = workbookId,
                VendorList = vendorList,
                BudgetHeadingTypeList = budgetHeadingTypeList,
                DefaultTransactionFromDate = defaultTransactionFromDate,
                DefaultTransactionToDate = defaultTransactionToDate
            };
        }

        public FinanceTransactionSet GetFinanceTransactionSet(string userName,
            int workbookId, DateTime transactionFromDate, DateTime? transactionToDate)
        {
            this.logger.Verbose(string.Format("Getting transactions from {0} to {1} in workbook {2} for user {3}...", 
                transactionFromDate, transactionToDate, workbookId, userName));

            this.authorizationService.Authorize(userName, workbookId);

            IEnumerable<Entities.FinanceTransaction> financeTransactionEntityList = null;

            try
            {
                this.Database.With(
                    this.financeTransactionRepository,
                    this.vendorMappingRepository,
                    this.budgetHeadingRepository,
                    this.vendorBudgetHeadingRepository).Execute(
                        unit =>
                        financeTransactionEntityList =
                        this
                            .GetFinanceTransactionsByTransactionDateAndWorkbookId(
                                workbookId, transactionFromDate, transactionToDate));
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(
                    ServiceErrorCodes.GetFinanceTransactionSetError);
            }

            var financeTransactionList = financeTransactionEntityList.ToDc();

            return new FinanceTransactionSet
            {
                WorkbookId = workbookId,
                TransactionFromDate = transactionFromDate,
                TransactionToDate = transactionToDate,
                FinanceTransactionList = financeTransactionList
            };
        }

        public FinanceTransactionSet UpdateFinanceTransactionSet(
            string userName, FinanceTransactionSet financeTransactionSet)
        {
            this.logger.Verbose(string.Format("Updating transactions for workbook {0} for user {1}...",
                financeTransactionSet.WorkbookId, userName));

            this.authorizationService.Authorize(userName, financeTransactionSet.WorkbookId);

            // We have to do 2 operations: delete the ones marked for deletion, and insert/update
            // the rest.

            var financeTransactionEntityListToSave = financeTransactionSet.FinanceTransactionList
                .Where(x => !x.IsMarkedForDeletion)
                .ToEntity(financeTransactionSet.WorkbookId);

            var financeTransactionEntityListToDelete = financeTransactionSet.FinanceTransactionList
                .Where(x => x.IsMarkedForDeletion && x.Id != 0)
                .ToEntity(financeTransactionSet.WorkbookId);

            try
            {
                this.Database
                    .With(this.financeTransactionRepository)
                    .Execute(unit =>
                    {
                        financeTransactionEntityListToDelete.ForEach(this.financeTransactionRepository.Delete);
                        financeTransactionEntityListToSave.ForEach(this.financeTransactionRepository.Save);
                    });
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(
                    ServiceErrorCodes.UpdateFinanceTransactionSetError);
            }

            financeTransactionSet.FinanceTransactionList = financeTransactionEntityListToSave.ToDc();

            return financeTransactionSet;
        }

        #endregion

        #region Methods (Private - Data Access)

        private void GetFinanceTransactionSetLookupData(int workbookId,
            out IEnumerable<Entities.Vendor> vendorList,
            out IEnumerable<Entities.BudgetHeadingType> budgetHeadingTypeList)
        {
            vendorList = this.GetVendorsByWorkbookId(workbookId);

            budgetHeadingTypeList = this.GetBudgetHeadingTypesByWorkbookId(workbookId);
        }

        private IEnumerable<Entities.FinanceTransaction> GetFinanceTransactionsByTransactionDateAndWorkbookId(
            int workbookId, DateTime transactionFromDate, DateTime? transactionToDate)
        {
            if (transactionToDate.HasValue)
            {
                return this.financeTransactionRepository.GetList(
                    query =>
                    query
                        .Where(x => x.TransactionDate >= transactionFromDate &&
                                    x.TransactionDate <= transactionToDate &&
                                    x.Workbook.Id == workbookId)
                        .ToList());
            }

            return this.financeTransactionRepository.GetList(
                query =>
                query
                    .Where(x => x.TransactionDate >= transactionFromDate &&
                                x.Workbook.Id == workbookId)
                    .ToList());
        }

        private IEnumerable<Entities.Vendor> GetVendorsByWorkbookId(int workbookId)
        {
            var vendorList = this.vendorMappingRepository.GetList(
                query => query.Where(x => x.Vendor.Workbook.Id == workbookId).ToList())
                .GroupBy(x => x.Vendor)
                .Select(
                    x =>
                    new Entities.Vendor
                    {
                        Id = x.Key.Id, 
                        Name = x.Key.Name, 
                        Workbook = x.Key.Workbook, 
                        VendorMappingList = x.ToList()
                    })
                .ToList();

            var vendorIdList = vendorList.Select(x => x.Id).ToList();

            var vendorBudgetHeadingList =
                this.vendorBudgetHeadingRepository.GetList(
                    query => query.Where(x => vendorIdList.Contains(x.Vendor.Id)).ToList());

            vendorList.ForEach(
                x => x.VendorBudgetHeadingList = vendorBudgetHeadingList
                    .Where(y => y.Vendor.Id == x.Id)
                    .OrderBy(y => y.IsDefault ? 1 : 2)
                    .ToList());

            return vendorList;
        }

        private IEnumerable<Entities.BudgetHeadingType> GetBudgetHeadingTypesByWorkbookId(int workbookId)
        {
            return this.budgetHeadingRepository.GetList(
                query => query.Where(x => x.BudgetHeadingType.Workbook.Id == workbookId).ToList())
                .GroupBy(x => x.BudgetHeadingType)
                .Select(x => new Entities.BudgetHeadingType
                {
                    Id = x.Key.Id,
                    Name = x.Key.Name,
                    Workbook = x.Key.Workbook,
                    BudgetHeadingList = x.ToList()
                })
                .ToList();
        }

        #endregion        
    }
}