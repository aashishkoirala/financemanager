/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.resources
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

declare var financeManagerApiRoot: string;

//------------------------------------------------------------------------------------------------------------------------------
    
module AK.FinanceManager.Web {
    export class Resources {

        static Workbook: string = 'Workbook';
        static FinanceTransactionSet: string = 'FinanceTransactionSet';
        static FinanceTransactionSetLookup: string = 'FinanceTransactionSetLookup';
        static Budget: string = 'Budget';
        static BudgetList: string = 'BudgetList';

        //----------------------------------------------------------------------------------------------------------------------
    
        static create = function($resource: any, resourceName: string): any {
            switch (resourceName) {

                case Resources.Workbook:
                    return $resource(financeManagerApiRoot + 'Workbook', {}, { getList: { method: 'GET', isArray: true } });

                case Resources.FinanceTransactionSet:
                    return $resource(financeManagerApiRoot + 'FinanceTransactionSet/:workbookId/:transactionDateFrom/:transactionDateTo', {
                        workbookId: '@workbookId',
                        transactionDateFrom: '@transactionDateFrom',
                        transactionDateTo: '@transactionDateTo'
                    }, { update: { method: 'PUT' } });

                case Resources.FinanceTransactionSetLookup:
                    return $resource(financeManagerApiRoot + 'FinanceTransactionSetLookup/:id', { id: '@id' });

                case Resources.Budget:
                    return $resource(financeManagerApiRoot + 'Budget/:id', { id: '@id' }, { update: { method: 'PUT' } });

                case Resources.BudgetList:
                    return $resource(financeManagerApiRoot + 'BudgetList/:id', { id: '@id' });
            }

            return null;
        }
    }
}