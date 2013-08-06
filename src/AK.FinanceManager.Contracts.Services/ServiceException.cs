/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.ServiceException
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

using AK.Commons.Exceptions;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

#endregion

namespace AK.FinanceManager.Contracts.Services
{
    /// <summary>
    /// Represents service exceptions.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public class ServiceException : ReasonedException<ServiceErrorCodes>
    {
        private static readonly IDictionary<ServiceErrorCodes, string> ErrorTextDictionary = 
            new Dictionary<ServiceErrorCodes, string>
        {
            {ServiceErrorCodes.NotAuthorized, "You do not have permissions to perform this operation."},
            {ServiceErrorCodes.GetBudgetListError, "There was a problem trying to load the list of budgets."},
            {ServiceErrorCodes.GetBudgetError, "There was a problem trying to retrieve the budget."},
            {ServiceErrorCodes.UpdateBudgetError, "There was a problem trying to update budget amounts."},
            {ServiceErrorCodes.CreateBudgetError, "There was a problem trying to create the new budget."},
            {ServiceErrorCodes.CreateBudgetInvalidPeriodStartDate, "The period start date must be earlier than the period end date."},
            {ServiceErrorCodes.CreateBudgetOverlappingDates, "Invalid period dates - they overlap with existing budget periods."},
            {ServiceErrorCodes.GetFinanceTransactionSetLookupError, "There was a problem trying to load the list of vendors and budget headings."},
            {ServiceErrorCodes.GetFinanceTransactionSetError, "There was a problem trying to load the transactions."},
            {ServiceErrorCodes.UpdateFinanceTransactionSetError, "There was a problem trying to save the transactions."}
        };

        public ServiceException(ServiceErrorCodes reason) : base(reason) {}
        public ServiceException(ServiceErrorCodes reason, string message) : base(reason, message) {}
        public ServiceException(ServiceErrorCodes reason, Exception innerException) : base(reason, innerException) {}
        public ServiceException(ServiceErrorCodes reason, string message, Exception innerException) : base(reason, message, innerException) {}
        public ServiceException(SerializationInfo info, StreamingContext context) : base(info, context) {}

        protected override string GetReasonDescription(ServiceErrorCodes reason)
        {
            return ErrorTextDictionary[reason];
        }
    }
}