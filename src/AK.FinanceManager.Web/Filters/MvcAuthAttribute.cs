/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Filters.MvcAuthAttribute
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

using AK.Commons.Web.Security;
using AK.FinanceManager.Web.Controllers;
using System;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

#endregion

namespace AK.FinanceManager.Web.Filters
{
    /// <summary>
    /// Handles Google SSO redirection and authentication for MVC controllers. Once logged in,
    /// writes out the auth-token and user names into cookies.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public class MvcAuthAttribute : WebAuthenticationFilterAttributeBase
    {
        private const string UserNameCookieName = "FM_UserName";

        protected override void OnAlreadyLoggedIn(AuthorizationContext filterContext)
        {
            var userNameCookie = filterContext.HttpContext.Request.Cookies[UserNameCookieName];
            if (userNameCookie == null)
            {
                FormsAuthentication.SignOut();
                filterContext.Result = new RedirectToRouteResult("Default",
                    new RouteValueDictionary(new { controller = "Home", action = "Main" }));
                return;
            }

            var ticket = FormsAuthentication.Decrypt(userNameCookie.Value);
            var userName = ticket.UserData;

            var controller = filterContext.Controller as IUserNameAwareController;
            if (controller != null) controller.UserName = userName;
        }

        protected override void OnSuccess(AuthorizationContext filterContext, WebAuthenticationResult authenticationResult)
        {
            var userName = authenticationResult.UserName;
            var ticket = new FormsAuthenticationTicket(1, UserNameCookieName, DateTime.Now, DateTime.Now.AddDays(1), false, userName);
            var cookieData = FormsAuthentication.Encrypt(ticket);
            filterContext.HttpContext.Response.Cookies.Add(new HttpCookie(UserNameCookieName, cookieData));
            filterContext.Result = new RedirectToRouteResult("Default",
                new RouteValueDictionary(new { controller = "Home", action = "Main" }));
        }

        protected override void OnDenied(AuthorizationContext filterContext, WebAuthenticationResult authenticationResult)
        {
            filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.Unauthorized, authenticationResult.ErrorMessage);
        }

        protected override void OnError(AuthorizationContext filterContext, WebAuthenticationResult authenticationResult)
        {
            filterContext.Result = new HttpStatusCodeResult(HttpStatusCode.Unauthorized, authenticationResult.ErrorMessage);
        }
    }
}