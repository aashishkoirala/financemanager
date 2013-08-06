/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Filters.ServiceExceptionFilterAttribute
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

using AK.FinanceManager.Contracts.Services;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

#endregion

namespace AK.FinanceManager.Web.Filters
{
    /// <summary>
    /// Handles service exceptions and formulates web API responses as required.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public class ServiceExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            if (!(actionExecutedContext.Exception is ServiceException))
            {
                base.OnException(actionExecutedContext);
                return;
            }

            var serviceException = actionExecutedContext.Exception as ServiceException;

            var statusCode = HttpStatusCode.InternalServerError;

            if(serviceException.Reason == ServiceErrorCodes.CreateBudgetInvalidPeriodStartDate || 
                serviceException.Reason == ServiceErrorCodes.CreateBudgetOverlappingDates)
                statusCode = HttpStatusCode.BadRequest;

            actionExecutedContext.Response = actionExecutedContext.Request.CreateErrorResponse(
                statusCode, serviceException.Message);
        }
    }
}