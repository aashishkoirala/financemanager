/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.Operation.IBudgetService
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
using System;
using System.Collections.Generic;

#endregion

namespace AK.FinanceManager.Contracts.Services.Operation
{
    /// <summary>
    /// Handles budget level operations.
    /// </summary>
    /// <author>Aashish Koirala</author>
    /// <todo>Extend Modeling Kit to be able to auto-generate these from model.</todo>
    public interface IBudgetService
    {
        /// <summary>
        /// Gets the list of budgets for the given user-workbook combo.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="workbookId">Workbook ID.</param>
        /// <returns>List of budgets.</returns>
        IList<BudgetListItem> GetBudgetList(string userName, int workbookId);

        /// <summary>
        /// Retrieves the given budget.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="id">Budget ID.</param>
        /// <returns>Budget object.</returns>
        Budget GetBudget(string userName, int id);     

        /// <summary>
        /// Updates budgeted amounts for the given budget.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="budget">Budget object.</param>
        /// <returns>Reference to budget object.</returns>
        Budget UpdateBudget(string userName, Budget budget);

        /// <summary>
        /// Creates a new budget based on the given parameters. Rolls over amounts from
        /// a previous budget if one exists.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="workbookId">Workbook ID.</param>
        /// <param name="periodStartDate">Budget start date.</param>
        /// <param name="periodEndDate">Budget end date.</param>
        /// <returns>Newly created budget object.</returns>
        Budget CreateBudget(string userName, int workbookId, DateTime periodStartDate, DateTime periodEndDate);
    }
}