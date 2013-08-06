/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.controllers.budget-controller
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
/// <reference path='../utils.ts' />
/// <reference path='../view-models.ts' />
/// <reference path='../services/budget-service.ts' />
/// <reference path='workbook-controller.ts' />

module AK.FinanceManager.Web.Controllers {
    export class BudgetControllerScope {
        budgetList: VMBu.BudgetListItem[] = [];
        budget: VMBu.Budget = null;
        sortBy: string = '';
        sortByReverse: bool = false;
        isTabActive: bool = false;
        workbookHasChanged: bool = false;
        newBudgetPeriodStartDate: string = '';
        newBudgetPeriodEndDate: string = '';

        //----------------------------------------------------------------------------------------------------------------------

        loadBudgetList(): void { };
        loadBudget(id: number): void { };
        saveBudget(): void { };
        createBudget(): void { };

        //----------------------------------------------------------------------------------------------------------------------

        getBudgetItemList(): VMBu.BudgetItem[] { return [] };
        formatAmount(budgetItem: VMBu.BudgetItem): void { };

        //----------------------------------------------------------------------------------------------------------------------

        getBudgetedInTotal(): number { return 0; };
        getBudgetedOutTotal(): number { return 0; };
        getBudgetedDiffTotal(): number { return 0; };
        getActualInTotal(): number { return 0; };
        getActualOutTotal(): number { return 0; };
        getActualDiffTotal(): number { return 0; };
        getDiffTotal(): number { return 0; };

        //----------------------------------------------------------------------------------------------------------------------

        $on(name: any, callback: any): void { };
        $emit(name: string): void { };
    }
}

//------------------------------------------------------------------------------------------------------------------------------

workbookController.controller('budgetCtrl', ['$scope', '$filter', 'budgetService',
    function ($scope: Ctrl.BudgetControllerScope,
        $filter: any, budgetService: Svc.BudgetService) {

        $scope.budgetList = [];
        $scope.budget = new VMBu.Budget();
        $scope.sortBy = '';
        $scope.sortByReverse = false;
        $scope.isTabActive = false;
        $scope.workbookHasChanged = false;
        $scope.newBudgetPeriodStartDate = '';
        $scope.newBudgetPeriodEndDate = '';

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadBudgetList = function (): void {
            
            $scope.workbookHasChanged = false;
            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.loadBudgetList(
                    $scope.budget.WorkbookId,
                    function (budgetList: VMBu.BudgetListItem[]) {
                        $scope.budgetList = budgetList;
                        Util.hideLoading($scope);

                        if ($scope.budgetList.length > 0) {
                            $scope.loadBudget($scope.budgetList[0].Id);
                        }

                    }, function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadBudget = function (id: number): void {

            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.loadBudget(id,
                    function (budget: VMBu.Budget) {
                        Util.hideLoading($scope);
                        $scope.budget = budget;
                    }, function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.saveBudget = function (): void {

            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.saveBudget($scope.budget,
                    function (budget: VMBu.Budget) {
                        Util.hideLoading($scope);
                        $scope.budget = budget;
                    }, function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.createBudget = function (): void {

            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.createBudget($scope.budget.WorkbookId, 
                    $scope.newBudgetPeriodStartDate, 
                    $scope.newBudgetPeriodEndDate,

                    function (budget: VMBu.Budget) {
                        Util.hideLoading($scope);
                        $scope.budget = budget;

                        var budgetListItem: VMBu.BudgetListItem = new VMBu.BudgetListItem();
                        budgetListItem.Id = budget.Id;
                        budgetListItem.Name = budget.BudgetName;
                        $scope.budgetList.unshift(budgetListItem);

                    }, function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getBudgetItemList = function (): VMBu.BudgetItem[] {
            var list: VMBu.BudgetItem[] = $scope.budget.BudgetItemList;

            if ($scope.budget.FilterBudgetHeadingType != null && $scope.budget.FilterBudgetHeadingType != '') {
                list = list.filter(function (x: VMBu.BudgetItem): bool {
                    return $scope.budget.FilterBudgetHeadingType == x.BudgetHeadingType;
                });
            }

            if ($scope.budget.FilterBudgetHeading != null && $scope.budget.FilterBudgetHeading != '') {
                list = list.filter(function (x: VMBu.BudgetItem): bool {
                    return $scope.budget.FilterBudgetHeading == x.BudgetHeading;
                });
            }

            return list;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.formatAmount = function (budgetItem: VMBu.BudgetItem): void {
            var amount: number = parseFloat(budgetItem.BudgetAmountAsString.trim().replace('$', '').replace(',', ''));
            if (isNaN(amount)) amount = 0;

            budgetItem.BudgetAmount = amount;
            budgetItem.BudgetAmountAsString = $filter('currency')(amount);
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getBudgetedInTotal = function (): number {
            var total: number = 0;

            $scope.budget.BudgetItemList.filter(function (x: VMBu.BudgetItem) {
                return x.IsMoneyComingIn;
            }).forEach(function (x: VMBu.BudgetItem) {
                total += x.BudgetAmount;
            });

            return total;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getBudgetedOutTotal = function (): number {
            var total: number = 0;

            $scope.budget.BudgetItemList.filter(function (x: VMBu.BudgetItem) {
                return !x.IsMoneyComingIn;
            }).forEach(function (x: VMBu.BudgetItem) {
                total += x.BudgetAmount;
            });

            return total;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getBudgetedDiffTotal = function (): number {
            return $scope.getBudgetedInTotal() - $scope.getBudgetedOutTotal();
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getActualInTotal = function (): number { 
            var total: number = 0;

            $scope.budget.BudgetItemList.filter(function (x: VMBu.BudgetItem) {
                return x.IsMoneyComingIn;
            }).forEach(function (x: VMBu.BudgetItem) {
                total += x.ActualAmount;
            });

            return total;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getActualOutTotal = function (): number {
            var total: number = 0;

            $scope.budget.BudgetItemList.filter(function (x: VMBu.BudgetItem) {
                return !x.IsMoneyComingIn;
            }).forEach(function (x: VMBu.BudgetItem) {
                total += x.ActualAmount;
            });

            return total;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getActualDiffTotal = function (): number {
            return $scope.getActualInTotal() - $scope.getActualOutTotal();
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getDiffTotal = function (): number {
            return ($scope.getActualInTotal() - $scope.getActualOutTotal()) - ($scope.getBudgetedInTotal() - $scope.getBudgetedOutTotal());
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('LoadWorkbook', function (event, workbookId: number) {
            $scope.budget.WorkbookId = workbookId;
            $scope.workbookHasChanged = true;
            if ($scope.isTabActive) $scope.loadBudgetList();
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('TabSelected', function (event, tab: string) {
            $scope.isTabActive = (tab == 'Budget');
            if ($scope.isTabActive && $scope.workbookHasChanged) $scope.loadBudgetList();
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$emit('CheckWorkbooks');
    }]);