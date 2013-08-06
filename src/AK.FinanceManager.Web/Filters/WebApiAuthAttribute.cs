/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Filters.WebApiAuthAttribute
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

using AK.FinanceManager.Web.Controllers;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Security;

#endregion

namespace AK.FinanceManager.Web.Filters
{
    /// <summary>
    /// Handles authentication for web API calls - looks for auth token and user name
    /// in cookies.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public class WebApiAuthAttribute : AuthorizationFilterAttribute
    {
        private const string UserNameCookieName = "FM_UserName";

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var apiController = actionContext.ControllerContext.Controller as ApiController;
            if (apiController == null)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;                
            }

            if (!apiController.User.Identity.IsAuthenticated)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;
            }

            // If, for some reason, they're logged in but there's no user name- that's a bad
            // login - kick 'em out.
            //
            var userNameCookie = HttpContext.Current.Request.Cookies[UserNameCookieName];
            if (userNameCookie == null)
            {
                FormsAuthentication.SignOut();
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                return;
            }

            var ticket = FormsAuthentication.Decrypt(userNameCookie.Value);
            var userName = ticket.UserData;

            var controller = actionContext.ControllerContext.Controller as IUserNameAwareController;
            if (controller != null) controller.UserName = userName;
        }        
    }
}