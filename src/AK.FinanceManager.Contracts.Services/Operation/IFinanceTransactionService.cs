/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.Operation.IFinanceTransactionService
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
using System;

#endregion

namespace AK.FinanceManager.Contracts.Services.Operation
{
    /// <summary>
    /// Handles transaction operations.
    /// </summary>
    /// <author>Aashish Koirala</author>
    /// <todo>Extend Modeling Kit to be able to auto-generate these from model.</todo>
    public interface IFinanceTransactionService
    {
        /// <summary>
        /// Gets lookup values to compliment a finance transaction set.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="workbookId">Workbook ID.</param>
        /// <returns>Lookup values for the workbook: includes vendors, budget headings.</returns>
        FinanceTransactionSetLookup GetFinanceTransactionSetLookup(string userName, int workbookId);

        /// <summary>
        /// Gets the transaction set matching the given parameters.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="workbookId">Workbook ID.</param>
        /// <param name="transactionFromDate">Include transactions from this date.</param>
        /// <param name="transactionToDate">Include transactions to this date, omit to skip filter.</param>
        /// <returns>Transaction set.</returns>
        FinanceTransactionSet GetFinanceTransactionSet(string userName, int workbookId, 
            DateTime transactionFromDate, DateTime? transactionToDate);

        /// <summary>
        /// Updates the given transaction set.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="financeTransactionSet">Transaction set.</param>
        /// <returns>Transaction set.</returns>
        FinanceTransactionSet UpdateFinanceTransactionSet(string userName, 
            FinanceTransactionSet financeTransactionSet);
    }
}