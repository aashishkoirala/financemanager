/*******************************************************************************************************************************
 * AK.FinanceManager.Services.FinanceTransactionServiceContractMappingExtensions
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

using AK.FinanceManager.Contracts.Services.Data.FinanceTransactionContracts;
using System.Collections.Generic;
using System.Linq;
using Entities = AK.FinanceManager.Contracts.DataAccess.Entities;

#endregion

namespace AK.FinanceManager.Services
{
    /// <summary>
    /// Mapping logic between data contracts/entities for FinanceTransactionService.
    /// </summary>
    /// <todo>Consider AutoMapper.</todo>
    /// <todo>Consider extending Modeling Kit to generate much of this.</todo>
    /// <author>Aashish Koirala</author>
    internal static class FinanceTransactionServiceContractMappingExtensions
    {
        public static IList<FinanceTransaction> ToDc(this
            IEnumerable<Entities.FinanceTransaction> financeTransactionList)
        {
            return financeTransactionList
                .Select(x => new FinanceTransaction
                {
                    Id = x.Id,
                    Amount = x.Amount,
                    BudgetHeadingId = x.BudgetHeading.Id,
                    Notes = x.Notes,
                    TransactionDate = x.TransactionDate,
                    VendorId = x.Vendor.Id
                })
                .ToList();
        }

        public static IList<Vendor> ToDc(this IEnumerable<Entities.Vendor> vendorList)
        {
            return vendorList
                .Select(x => new Vendor
                {
                    Id = x.Id,
                    Name = x.Name,
                    MappedNameList = x.VendorMappingList
                                 .Select(y => y.MappedName)
                                 .ToList(),
                    BudgetHeadingList = x.VendorBudgetHeadingList
                                 .Select(y => y.BudgetHeading)
                                 .Select(y => new BudgetHeading {Id = y.Id, Name = y.Name})
                                 .ToList()
                })
                .ToList();
        }

        public static IList<BudgetHeadingType> ToDc(this
            IEnumerable<Entities.BudgetHeadingType> budgetHeadingTypeList)
        {
            return budgetHeadingTypeList
                .Select(x => new BudgetHeadingType
                {
                    Id = x.Id,
                    Name = x.Name,
                    BudgetHeadingList = x.BudgetHeadingList
                                 .Select(y => new BudgetHeading {Id = y.Id, Name = y.Name})
                                 .ToList()
                })
                .ToList();
        }

        public static IEnumerable<Entities.FinanceTransaction> ToEntity(this
            IEnumerable<FinanceTransaction> financeTransactionList, int workbookId)
        {
            return financeTransactionList
                .Select(x => new Entities.FinanceTransaction
                {
                    Id = x.Id,
                    TransactionDate = x.TransactionDate,
                    Amount = x.Amount,
                    Notes = x.Notes,
                    BudgetHeading = new Entities.BudgetHeading {Id = x.BudgetHeadingId},
                    Vendor = new Entities.Vendor {Id = x.VendorId},
                    Workbook = new Entities.Workbook {Id = workbookId}
                }).ToList();
        }
    }
}