/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.services.budget-service
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

    export class BudgetService {

        BudgetResource = null;
        BudgetListResource = null;

        //----------------------------------------------------------------------------------------------------------------------

         constructor(resource) { 
            this.BudgetResource = Resources.create(resource, Resources.Budget);
            this.BudgetListResource = Resources.create(resource, Resources.BudgetList);
        }

        //----------------------------------------------------------------------------------------------------------------------

        loadBudgetList(workbookId: number,
            success: (budgetList: VMBu.BudgetListItem[]) => void ,
            error: (errorMessage: string) => void ): void {

            var budgetList = this.BudgetListResource.query({ id: workbookId },
                function () {
                    success(budgetList);
                }, function (response) {
                    error(response.data.Message);
                });
        }

        //----------------------------------------------------------------------------------------------------------------------

        loadBudget(id: number, 
            success: (budget: VMBu.Budget) => void ,
            error: (errorMessage: string) => void ): void {

            var budget = this.BudgetResource.get({
                id: id,
            }, function () {
                success(budget);
            }, function (response) {
                error(response.data.Message);
            });
        }

        //----------------------------------------------------------------------------------------------------------------------

        saveBudget(budget: VMBu.Budget,
            success: (budget: VMBu.Budget) => void ,
            error: (errorMessage: string) => void ): void {

            var transactionData = {
                Id: budget.Id,
                WorkbookId: budget.WorkbookId,
                BudgetItemList: budget.BudgetItemList
            };

            var self: BudgetService = this;

            var resource = self.BudgetResource.update(transactionData, function () {
                success(resource);
            }, function (response) {
                error(response.data.Message);
            });
        }

        //----------------------------------------------------------------------------------------------------------------------

        createBudget(workbookId: number, 
            periodStartDate: string, periodEndDate: string, 
            success: (budget: VMBu.Budget) => void, 
            error: (errorMessage: string) => void ): void {

            var transactionData = {
                WorkbookId: workbookId,
                PeriodStartDate: periodStartDate,
                PeriodEndDate: periodEndDate
            };

            var self: BudgetService = this;

            var resource = self.BudgetResource.save(transactionData, function () {
                success(resource);
            }, function (response) {
                error(response.data.Message);
            });
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerServices.factory('budgetService', function ($resource): Svc.BudgetService {
    return new Svc.BudgetService($resource);
});