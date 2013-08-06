/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.BudgetController
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
using System;
using System.ComponentModel.Composition;
using System.Net;
using System.Net.Http;
using System.Web.Http;

#endregion

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// Web API controller for "Budget" resource.
    /// </summary>
    /// <author>Aashish Koirala</author>
    [Export, PartCreationPolicy(CreationPolicy.NonShared), WebApiAuth, ServiceExceptionFilter]
    public class BudgetController : ApiController, IUserNameAwareController
    {
        #region Fields/Properties

        [Import] private IBudgetService budgetService;

        public string UserName { get; set; }

        #endregion

        #region Actions

        public Budget GetBudget(int id)
        {
            return this.budgetService.GetBudget(this.UserName, id);
        }

        public Budget PutBudget(Budget budget)
        {
            return this.budgetService.UpdateBudget(this.UserName, budget);
        }

        public HttpResponseMessage PostBudget(BudgetCreationRequest request)
        {
            DateTime periodStartDateParsed, periodEndDateParsed;

            if (!DateTime.TryParse(request.PeriodStartDate, out periodStartDateParsed))
                throw new HttpResponseException(HttpStatusCode.BadRequest);

            if (!DateTime.TryParse(request.PeriodEndDate, out periodEndDateParsed))
                throw new HttpResponseException(HttpStatusCode.BadRequest);

            var budget = this.budgetService.CreateBudget(this.UserName, 
                request.WorkbookId, periodStartDateParsed, periodEndDateParsed);

            var response = this.Request.CreateResponse(HttpStatusCode.Created, budget);

            response.Headers.Location =
                new Uri(this.Url.Link("Default", new { controller = "Budget", id = budget.Id }));

            return response;
        }

        #endregion
    }
}