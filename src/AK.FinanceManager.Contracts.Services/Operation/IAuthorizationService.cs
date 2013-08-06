/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.Operation.IAuthorizationService
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

using AK.FinanceManager.Contracts.Services.Data.AuthorizationContracts;
using System.Collections.Generic;

#endregion

namespace AK.FinanceManager.Contracts.Services.Operation
{
    /// <summary>
    /// Handles authorization and workbook access for users.
    /// </summary>
    /// <author>Aashish Koirala</author>
    /// <todo>Extend Modeling Kit to be able to auto-generate these from model.</todo>
    public interface IAuthorizationService
    {
        /// <summary>
        /// Checks access to the given workbook for the given user.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <param name="workbookId">Workbook ID.</param>
        /// <exception cref="ServiceException">If user is not authorized.</exception>
        void Authorize(string userName, int workbookId);

        /// <summary>
        /// Gets the list of workbooks for the given user.
        /// </summary>
        /// <param name="userName">User name.</param>
        /// <returns>List of workbooks</returns>
        IList<Workbook> GetWorkbookList(string userName);
    }
}