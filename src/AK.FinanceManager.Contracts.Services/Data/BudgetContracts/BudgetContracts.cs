/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.Data.BudgetContracts
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

using System.Collections.Generic;
using System.Globalization;

#endregion

namespace AK.FinanceManager.Contracts.Services.Data.BudgetContracts
{
    // TODO: Extend Modeling Kit to be able to auto-generate these from model.

    public class BudgetListItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class Budget
    {
        public int Id { get; set; }
        public string BudgetName { get; set; }
        public int WorkbookId { get; set; }
        public IList<BudgetItem> BudgetItemList { get; set; }
        public IList<string> BudgetHeadingTypeList { get; set; }
        public IList<string> BudgetHeadingList { get; set; }
    }

    public class BudgetItem
    {
        public int Id { get; set; }
        public bool IsMoneyComingIn { get; set; }
        public string BudgetHeadingType { get; set; }
        public string BudgetHeading { get; set; }
        public decimal BudgetAmount { get; set; }
        public decimal ActualAmount { get; set; }

        public string BudgetAmountAsString
        {
            get { return string.Format("{0:C2}", this.BudgetAmount); }
            set { this.BudgetAmount = decimal.Parse(value, NumberStyles.Currency | NumberStyles.AllowCurrencySymbol); }
        }
    }

    public class BudgetCreationRequest
    {
        public int WorkbookId { get; set; }
        public string PeriodStartDate { get; set; }
        public string PeriodEndDate { get; set; }        
    }
}