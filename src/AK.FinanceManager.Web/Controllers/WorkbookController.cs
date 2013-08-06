/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.WorkbookController
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
using AK.FinanceManager.Contracts.Services.Operation;
using AK.FinanceManager.Web.Filters;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Web.Http;

#endregion

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// Web API controller for "Workbook" resource.
    /// </summary>
    /// <author>Aashish Koirala</author>
    [Export, PartCreationPolicy(CreationPolicy.NonShared), WebApiAuth, ServiceExceptionFilter]
    public class WorkbookController : ApiController, IUserNameAwareController
    {
        #region Fields/Properties

        [Import] private IAuthorizationService authorizationService;

        public string UserName { get; set; }

        #endregion

        #region Actions

        public IList<Workbook> GetWorkbookList()
        {
            return this.authorizationService.GetWorkbookList(this.UserName);
        }

        #endregion
    }
}