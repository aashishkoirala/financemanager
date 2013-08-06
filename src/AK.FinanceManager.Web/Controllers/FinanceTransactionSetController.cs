/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.FinanceTransactionSetController
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
using AK.FinanceManager.Contracts.Services.Data.FinanceTransactionContracts;
using AK.FinanceManager.Contracts.Services.Operation;
using AK.FinanceManager.Web.Filters;
using System;
using System.ComponentModel.Composition;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

#endregion

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// Web API controller for "FinanceTransactionSet" resource.
    /// </summary>
    /// <author>Aashish Koirala</author>
    [Export, PartCreationPolicy(CreationPolicy.NonShared), WebApiAuth, ServiceExceptionFilter]
    public class FinanceTransactionSetController : ApiController, IUserNameAwareController
    {
        #region Fields/Properties

        [Import] private IFinanceTransactionService financeTransactionService;

        public string UserName { get; set; }

        #endregion

        #region Actions

        public FinanceTransactionSet GetFinanceTransactionSet(int workbookId,
            string transactionDateFrom, string transactionDateTo = null)
        {
            DateTime transactionDateFromParsed;
            DateTime? transactionDateToParsed;

            if (!(DateTime.TryParse(transactionDateFrom, out transactionDateFromParsed)))
                throw new HttpResponseException(HttpStatusCode.BadRequest);

            if (string.IsNullOrWhiteSpace(transactionDateTo)) transactionDateToParsed = null;
            else
            {
                DateTime date;
                if (!(DateTime.TryParse(transactionDateTo, out date)))
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                transactionDateToParsed = date;
            }

            return this.financeTransactionService.GetFinanceTransactionSet(this.UserName,
                workbookId, transactionDateFromParsed, transactionDateToParsed);
        }

        public void PutFinanceTransactionSet(FinanceTransactionSet financeTransactionSet)
        {
            // PUT ignores new items.
            //
            financeTransactionSet.FinanceTransactionList =
                financeTransactionSet.FinanceTransactionList.Where(x => x.Id > 0).ToList();

            this.financeTransactionService.UpdateFinanceTransactionSet(
                this.UserName, financeTransactionSet);
        }

        public HttpResponseMessage PostFinanceTransactionSet(FinanceTransactionSet financeTransactionSet)
        {
            // POST only works on new items.
            //
            financeTransactionSet.FinanceTransactionList = financeTransactionSet.FinanceTransactionList
                .Where(x => x.Id <= 0 && !x.IsMarkedForDeletion)
                .ToList();

            financeTransactionSet.FinanceTransactionList.ForEach(x => x.Id = 0);

            financeTransactionSet = this.financeTransactionService.UpdateFinanceTransactionSet(
                this.UserName, financeTransactionSet);

            var response = this.Request.CreateResponse(HttpStatusCode.Created, financeTransactionSet);

            response.Headers.Location =
                new Uri(this.Url.Link("GetFinanceTransactionSet",
                                      new
                                      {
                                          workbookId = financeTransactionSet.WorkbookId,
                                          transactionDateFrom = financeTransactionSet.TransactionFromDate,
                                          transactionDateTo = financeTransactionSet.TransactionToDate
                                      }));

            return response;
        }

        #endregion
    }
}