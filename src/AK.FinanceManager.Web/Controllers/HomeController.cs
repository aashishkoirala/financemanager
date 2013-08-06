/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.HomeController
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

using AK.FinanceManager.Web.Filters;
using AK.FinanceManager.Web.ViewModels;
using System.ComponentModel.Composition;
using System.Reflection;
using System.Web.Mvc;
using System.Web.Security;

#endregion

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// MVC controller for the main home page.
    /// </summary>
    /// <author>Aashish Koirala</author>
    [Export, PartCreationPolicy(CreationPolicy.NonShared), MvcAuth]
    public class HomeController : Controller, IUserNameAwareController
    {
        #region Fields/Constants/Properties

        private const string ApiRoot = "~/api/";

        public string UserName { get; set; }

        #endregion

        #region Actions

        /// <summary>
        /// Default entry point action.
        /// </summary>
        public ActionResult Main()
        {
            return this.View(new SiteViewModel
            {
                ApplicationName = "Finance Manager",
                UserName = this.UserName,
                ApiRoot = this.Url.Content(ApiRoot),
                Version = Assembly.GetExecutingAssembly().GetName().Version.ToString(3)
            });            
        }

        /// <summary>
        /// Logout action.
        /// </summary>
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();

            return this.View(new SiteViewModel
            {
                ApplicationName = "Finance Manager",
                UserName = string.Empty,
                ApiRoot = this.Url.Content(ApiRoot)
            });
        }

        #endregion
    }
}