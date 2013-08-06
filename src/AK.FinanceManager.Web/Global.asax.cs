/*******************************************************************************************************************************
 * AK.FinanceManager.Web.MvcApplication
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

using AK.Commons;
using AK.Commons.Configuration;
using AK.Commons.Web.Composition;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

#endregion

namespace AK.FinanceManager.Web
{
    /// <summary>
    /// Web application.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            ConfigureWebApiRoutes();
            GlobalFilters.Filters.Add(new HandleErrorAttribute());
            ConfigureMvcRoutes();

            var webConfigFile = this.Server.MapPath("~/Web.config");

            var config = ConfigurationManager.OpenMappedExeConfiguration(
                new ExeConfigurationFileMap { ExeConfigFilename = webConfigFile }, 
                ConfigurationUserLevel.None);

            AppEnvironment.Initialize(
                "FinanceManager",
                new InitializationOptions
                {
                    ConfigStore = config.GetConfigStore(),
                    EnableLogging = true,
                    GenerateServiceClients = false
                });

            var bundlesJsonFile = this.Server.MapPath("~/Bundles.json");
            AppEnvironment.BundleConfigurator.Configure(File.ReadAllText(bundlesJsonFile));

            ControllerBuilder.Current.SetControllerFactory(new ComposableControllerFactory());
            GlobalConfiguration.Configuration.DependencyResolver = new ComposableDependencyResolver();
        }

        private static void ConfigureWebApiRoutes()
        {
            var config = GlobalConfiguration.Configuration;

            config.Routes.MapHttpRoute(
                "GetFinanceTransactionSet",
                "api/FinanceTransactionSet/{workbookId}/{transactionDateFrom}/{transactionDateTo}",
                new {controller = "FinanceTransactionSet", transactionDateTo = ""});

            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new {id = RouteParameter.Optional});
        }

        private static void ConfigureMvcRoutes()
        {
            var routes = RouteTable.Routes;

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default",
                "{controller}/{action}",
                new { controller = "Home", action = "Main" });
        }
    }
}