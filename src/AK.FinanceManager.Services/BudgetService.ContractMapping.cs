/*******************************************************************************************************************************
 * AK.FinanceManager.Services.BudgetServiceContractMappingExtensions
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

using AK.FinanceManager.Contracts.Services.Data.BudgetContracts;
using System.Collections.Generic;
using System.Linq;
using Entities = AK.FinanceManager.Contracts.DataAccess.Entities;

#endregion

namespace AK.FinanceManager.Services
{
    /// <summary>
    /// Mapping logic between data contracts/entities for BudgetService.
    /// </summary>
    /// <todo>Consider AutoMapper.</todo>
    /// <todo>Consider extending Modeling Kit to generate much of this.</todo>
    /// <author>Aashish Koirala</author>
    internal static class BudgetServiceContractMappingExtensions
    {
        public static IList<BudgetListItem> ToDc(this IEnumerable<Entities.Budget> entityList)
        {
            return entityList
                .OrderByDescending(x => x.PeriodStartDate)
                .ThenByDescending(x => x.PeriodEndDate)
                .Select(x => new BudgetListItem
                {
                    Id = x.Id,
                    Name = x.PeriodStartDate.ToString("MM/dd/yyyy") + " - " + x.PeriodEndDate.ToString("MM/dd/yyyy")
                })
                .ToList();
        }

        public static Budget ToDc(this Entities.Budget entity, IDictionary<int, decimal> actualAmountDictionary)
        {
            var budget = new Budget
            {
                WorkbookId = entity.Workbook.Id,
                Id = entity.Id,
                BudgetName = entity.PeriodStartDate.ToString("MM/dd/yyyy") + " - " + entity.PeriodEndDate.ToString("MM/dd/yyyy"),
                BudgetItemList = entity.BudgetItemList
                    .Select(x => new BudgetItem
                    {
                        Id = x.Id,
                        IsMoneyComingIn = x.BudgetHeading.BudgetHeadingType.IsMoneyComingIn,
                        BudgetHeading = x.BudgetHeading.Name,
                        BudgetHeadingType = x.BudgetHeading.BudgetHeadingType.Name,
                        BudgetAmount = x.Amount,
                        ActualAmount =
                            actualAmountDictionary.ContainsKey(x.BudgetHeading.Id)
                                ? actualAmountDictionary[x.BudgetHeading.Id]
                                : 0
                    })
                    .OrderBy(x => x.IsMoneyComingIn ? 1 : 2)
                    .ThenBy(x => x.BudgetHeadingType)
                    .ThenBy(x => x.BudgetHeading)
                    .ToList()
            };

            budget.BudgetHeadingList = budget.BudgetItemList
                .Select(x => x.BudgetHeading)
                .Distinct()
                .ToList();

            budget.BudgetHeadingTypeList = budget.BudgetItemList
                .Select(x => x.BudgetHeadingType)
                .Distinct()
                .ToList();

            return budget;
        }
    }
}