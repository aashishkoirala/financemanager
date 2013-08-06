/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.Data.FinanceTransactionContracts
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

using System;
using System.Collections.Generic;
using System.Globalization;

#endregion

namespace AK.FinanceManager.Contracts.Services.Data.FinanceTransactionContracts
{
    // TODO: Extend Modeling Kit to be able to auto-generate these from model.

    public class FinanceTransactionSetLookup
    {
        public int WorkbookId { get; set; }
        public IList<Vendor> VendorList { get; set; }
        public IList<BudgetHeadingType> BudgetHeadingTypeList { get; set; }
        public DateTime DefaultTransactionFromDate { get; set; }
        public DateTime? DefaultTransactionToDate { get; set; }

        public string DefaultTransactionFromDateAsString
        {
            get { return this.DefaultTransactionFromDate.ToString("yyyy-MM-dd"); }
        }

        public string DefaultTransactionToDateAsString
        {
            get
            {
                return this.DefaultTransactionToDate.HasValue
                           ? this.DefaultTransactionToDate.Value.ToString("yyyy-MM-dd")
                           : string.Empty;
            }
        }
    }

    public class FinanceTransactionSet
    {
        public int WorkbookId { get; set; }
        public DateTime TransactionFromDate { get; set; }
        public DateTime? TransactionToDate { get; set; }
        public IList<FinanceTransaction> FinanceTransactionList { get; set; }

        public string TransactionFromDateAsString
        {
            get { return this.TransactionFromDate.ToString("yyyy-MM-dd"); }
        }

        public string TransactionToDateAsString
        {
            get
            {
                return this.TransactionToDate.HasValue
                           ? this.TransactionToDate.Value.ToString("yyyy-MM-dd")
                           : string.Empty;
            }
        }
    }

    public class FinanceTransaction
    {
        public int Id { get; set; }
        public DateTime TransactionDate { get; set; }
        public int VendorId { get; set; }
        public int BudgetHeadingId { get; set; }
        public decimal Amount { get; set; }
        public string Notes { get; set; }
        public bool IsMarkedForDeletion { get; set; }

        public string TransactionDateAsString
        {
            get { return this.TransactionDate.ToString("yyyy-MM-dd"); }
            set { this.TransactionDate = DateTime.Parse(value); }
        }

        public string AmountAsString
        {
            get { return string.Format("{0:C2}", this.Amount); }
            set { this.Amount = decimal.Parse(value, NumberStyles.Currency | NumberStyles.AllowCurrencySymbol); }
        }
    }

    public class Vendor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<BudgetHeading> BudgetHeadingList { get; set; }
        public IList<string> MappedNameList { get; set; }
    }

    public class BudgetHeading
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class BudgetHeadingType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<BudgetHeading> BudgetHeadingList { get; set; }
    }
}