/*******************************************************************************************************************************
 * AK.FinanceManager.Services.AuthorizationService
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

using AK.Commons.DataAccess;
using AK.Commons.Exceptions;
using AK.Commons.Logging;
using AK.FinanceManager.Contracts.DataAccess.Repositories;
using AK.FinanceManager.Contracts.Services;
using AK.FinanceManager.Contracts.Services.Data.AuthorizationContracts;
using AK.FinanceManager.Contracts.Services.Operation;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using Entities = AK.FinanceManager.Contracts.DataAccess.Entities;

#endregion

namespace AK.FinanceManager.Services
{
    /// <summary>
    /// Service implementation - see IAuthorizationService.
    /// </summary>
    /// <see cref="IAuthorizationService"/>
    /// <author>Aashish Koirala</author>
    [Export(typeof (IAuthorizationService)), PartCreationPolicy(CreationPolicy.Shared)]
    public class AuthorizationService : IAuthorizationService
    {
        #region Fields

        [Import] private IAppLogger logger;
        [Import] private IAppDataAccess appDataAccess;
        [Import] private IAppUserWorkbookRepository appUserWorkbookRepository;

        #endregion

        #region Properties

        private IUnitOfWorkFactory Database
        {
            get { return appDataAccess["FinanceManager"]; }
        }

        #endregion

        #region Methods (Public - IAuthorizationService)

        public void Authorize(string userName, int workbookId)
        {
            this.logger.Verbose(string.Format("Authorizing user {0} for workbook {1}...", userName, workbookId));

            // Whether the user has access is based purely on the existence of an AppUserWorkbook
            // record with the given username and workbook ID.
            //
            var hasAccess = false;
            this.Database.With(this.appUserWorkbookRepository).Execute(unit =>
            {
                hasAccess =
                    this.appUserWorkbookRepository.GetFor(
                        q => q.Any(x => x.AppUser.UserName == userName && x.Workbook.Id == workbookId));
            });

            if (hasAccess) return;

            this.logger.Error(string.Format("User {0} does not have access to workbook {1}.", userName, workbookId));
            throw new ServiceException(ServiceErrorCodes.NotAuthorized);
        }

        public IList<Workbook> GetWorkbookList(string userName)
        {
            this.logger.Verbose(string.Format("Retrieving workbook list for user {0}...", userName));

            IList<Workbook> list = null;
            try
            {
                this.Database.With(this.appUserWorkbookRepository).Execute(unit =>
                {
                    list = this.appUserWorkbookRepository
                        .GetFor<IList<Entities.Workbook>>(
                            q => q
                                     .Where(x => x.AppUser.UserName == userName)
                                     .Select(x => x.Workbook)
                                     .ToList())
                        .Select(x => new Workbook {Id = x.Id, Name = x.Name})
                        .ToList();
                });
            }
            catch (Exception ex)
            {
                ex.WrapLogAndThrow<ServiceException, ServiceErrorCodes>(ServiceErrorCodes.GetWorkbookListError);
            }

            return list;
        }

        #endregion
    }
}