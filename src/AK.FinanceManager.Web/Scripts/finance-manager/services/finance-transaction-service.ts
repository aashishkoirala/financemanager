/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.services.finance-transaction-service
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

/// <reference path='../../angular-1.0.d.ts' />
/// <reference path='../view-models.ts' />
/// <reference path='../resources.ts' />
/// <reference path='services.ts' />

module AK.FinanceManager.Web.Services {

    export class FinanceTransactionService {

        financeTransactionSetLookupResource = null;
        financeTransactionSetResource = null;

        //----------------------------------------------------------------------------------------------------------------------

        constructor(resource) { 
            this.financeTransactionSetLookupResource = Resources.create(resource, Resources.FinanceTransactionSetLookup);
            this.financeTransactionSetResource = Resources.create(resource, Resources.FinanceTransactionSet);
        }

        //----------------------------------------------------------------------------------------------------------------------

        loadTransactionListLookup(workbookId: number,
            success: (lookupData: any) => void ,
            error: (errorMessage: string) => void ): void {

            var financeTransactionSetLookup = this.financeTransactionSetLookupResource.get({ id: workbookId },
                function () {
                    success(financeTransactionSetLookup);
                }, function (response) {
                    error(response.data.Message);
                });
        }

        //----------------------------------------------------------------------------------------------------------------------

        loadTransactionList(
            workbookId: number, transactionFromDateAsString: string, transactionToDateAsString: string,
            success: (financeTransactionList: VMTx.FinanceTransaction[]) => void ,
            error: (errorMessage: string) => void ): void {

            var financeTransactionSet = this.financeTransactionSetResource.get({
                workbookId: workbookId,
                transactionDateFrom: transactionFromDateAsString,
                transactionDateTo: transactionToDateAsString
            }, function () {
                success(financeTransactionSet.FinanceTransactionList);
            }, function (response) {
                error(response.data.Message);
            });
        }

        //----------------------------------------------------------------------------------------------------------------------

        saveTransactionList(financeTransactionSet: VMTx.FinanceTransactionSet,
            success: (financeTransactionSet: VMTx.FinanceTransactionSet) => void ,
            error: (errorMessage: string) => void ): void {

            var transactionData = {
                WorkbookId: financeTransactionSet.WorkbookId,
                TransactionFromDateAsString: financeTransactionSet.TransactionFromDateAsString,
                TransactionToDateAsString: financeTransactionSet.TransactionToDateAsString,
                FinanceTransactionList: financeTransactionSet.FinanceTransactionList
            };

            var self: FinanceTransactionService = this;

            self.financeTransactionSetResource.update(transactionData, function () {
                var resource = self.financeTransactionSetResource.save(transactionData, function () {
                    success(resource);
                }, function (response) {
                    error(response.data.Message);
                });
            }, function (response) {
                error(response.data.Message);
            });
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------

financeManagerServices.factory('financeTransactionService', function ($resource): Svc.FinanceTransactionService {
    return new Svc.FinanceTransactionService($resource);
});