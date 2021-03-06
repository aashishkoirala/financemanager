﻿/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.BudgetListController
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
using AK.FinanceManager.Contracts.Services.Operation;
using AK.FinanceManager.Web.Filters;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Web.Http;

#endregion

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// Web API controller for "BudgetList" resource.
    /// </summary>
    /// <author>Aashish Koirala</author>
    [Export, PartCreationPolicy(CreationPolicy.NonShared), WebApiAuth, ServiceExceptionFilter]
    public class BudgetListController : ApiController, IUserNameAwareController
    {
        #region Fields/Properties

        [Import] private IBudgetService budgetService;

        public string UserName { get; set; }

        #endregion

        #region Actions

        public IList<BudgetListItem> GetBudgetList(int id)
        {
            return this.budgetService.GetBudgetList(this.UserName, id);
        }

        #endregion
    }
}