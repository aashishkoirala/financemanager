/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.controllers.transaction-controller
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
/// <reference path='../services/finance-transaction-service.ts' />
/// <reference path='workbook-controller.ts' />

module AK.FinanceManager.Web.Controllers {
    export class TransactionControllerScope {
        transactions: VMTx.FinanceTransactionSet = null;
        sortBy: string = '';
        sortByReverse: bool = false;
        selectedTransaction: VMTx.FinanceTransaction = null;
        isTabActive: bool = false;
        workbookHasChanged: bool = false;
        newTransactionId: number = 0;

        //----------------------------------------------------------------------------------------------------------------------

        loadLookup(): void { };
        loadTransactions(): void { };
        saveTransactions(): void { };

        //----------------------------------------------------------------------------------------------------------------------

        getTransactionList(): VMTx.FinanceTransaction[] { return null; };
        addTransaction(): void { };
        formatAmount(transaction: VMTx.FinanceTransaction): void { };
        selectTransaction(id: number): void { };
        getSelectedBudgetHeadingTypeId(): number { return 0; };
        getSelectedVendorId(): number { return 0; };

        //----------------------------------------------------------------------------------------------------------------------

        $watch(expression: any, callback: any): void { };
        $on(name: any, callback: any): void { };
        $emit(name: string): void { };
    }
}

//------------------------------------------------------------------------------------------------------------------------------

workbookController.controller('transactionCtrl', ['$scope', '$filter', 'financeTransactionService',
    function ($scope: Ctrl.TransactionControllerScope,
        $filter: any,
        financeTransactionService: Svc.FinanceTransactionService) {

        $scope.transactions = new VMTx.FinanceTransactionSet();
        $scope.sortBy = 'TransactionDateAsString';
        $scope.sortByReverse = true;
        $scope.selectedTransaction = null;
        $scope.isTabActive = true;
        $scope.workbookHasChanged = false;
        $scope.newTransactionId = -1;

        //----------------------------------------------------------------------------------------------------------------------

        var updateBudgetHeadingTypeIds = function (transaction: VMTx.FinanceTransaction = null): void {

            var list: VMTx.FinanceTransaction[] = transaction != null ? 
                [transaction] : $scope.transactions.FinanceTransactionList;

            list.forEach(function (x: VMTx.FinanceTransaction) {
            
                var matchingBudgetHeadingTypeList = $scope.transactions.BudgetHeadingTypeList
                    .filter(function (y: VMTx.BudgetHeadingType) {

                        return y.BudgetHeadingList.some(function (z: VMTx.BudgetHeading) {
                            return z.Id == x.BudgetHeadingId;
                        })
                    });

                if (matchingBudgetHeadingTypeList.length > 0) {
                    x.BudgetHeadingTypeId = matchingBudgetHeadingTypeList[0].Id;
                    x.BudgetHeadingList = matchingBudgetHeadingTypeList[0].BudgetHeadingList;
                }
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        var addWatches = function (): void {

            $scope.$watch('getSelectedBudgetHeadingTypeId()', function (newValue: number, oldValue: number) {

                if (newValue == oldValue) return;

                var tx: VMTx.FinanceTransaction = $scope.selectedTransaction;
                if (tx == null) return;

                if (oldValue == tx.BudgetHeadingTypeId) return;

                tx.BudgetHeadingList = [];
                if (tx.BudgetHeadingTypeId == null || tx.BudgetHeadingTypeId == 0) return;

                tx.BudgetHeadingList = $scope.transactions.BudgetHeadingTypeList
                    .filter(function (y: VMTx.BudgetHeadingType) {

                        return y.Id == tx.BudgetHeadingTypeId;
                    })[0].BudgetHeadingList;
            });

            $scope.$watch('getSelectedVendorId()', function (newValue: number, oldValue: number) {

                if (newValue == oldValue) return;

                var tx: VMTx.FinanceTransaction = $scope.selectedTransaction;
                if (tx == null) return;

                if (oldValue == tx.VendorId) return;

                var matchingVendorList = $scope.transactions.VendorList.filter(function (x: VMTx.Vendor) {
                    return x.Id == tx.VendorId;
                });
                if (matchingVendorList.length == 0) return;

                var matchingBudgetHeadingList: VMTx.BudgetHeading[] = matchingVendorList[0].BudgetHeadingList;
                if (matchingBudgetHeadingList.length == 0) return;

                var matchingBudgetHeadingId: number = matchingBudgetHeadingList[0].Id;
                if (tx.BudgetHeadingId == matchingBudgetHeadingId) return;

                tx.BudgetHeadingId = matchingBudgetHeadingId;

                updateBudgetHeadingTypeIds(tx);
            });

            $scope.$watch('transactions.FilterBudgetHeadingTypeId', function (newValue: number, oldValue: number) {

                if (newValue == oldValue) return;

                if (newValue == null || newValue == 0) {
                    $scope.transactions.FilterBudgetHeadingList = [];
                    return;
                }

                $scope.transactions.FilterBudgetHeadingList = $scope.transactions.BudgetHeadingTypeList
                    .filter(function (y: VMTx.BudgetHeadingType) {

                        return y.Id == newValue;
                    })[0].BudgetHeadingList;
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        var initModel = function (): void {
            updateBudgetHeadingTypeIds();
            addWatches();
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadLookup = function (): void {

            Util.showLoading($scope);
            $scope.transactions.BudgetHeadingTypeList = [];
            $scope.transactions.VendorList = [];
            $scope.transactions.FinanceTransactionList = [];
            $scope.workbookHasChanged = false;

            Util.execute(function () {

                financeTransactionService.loadTransactionListLookup($scope.transactions.WorkbookId,
                    function (lookupData) {

                        Util.hideLoading($scope);
                        $scope.transactions.BudgetHeadingTypeList = lookupData.BudgetHeadingTypeList;
                        $scope.transactions.VendorList = lookupData.VendorList;
                        $scope.transactions.TransactionFromDateAsString = lookupData.DefaultTransactionFromDateAsString;
                        $scope.transactions.TransactionToDateAsString = lookupData.DefaultTransactionToDateAsString;
                        initModel();

                        if ($scope.transactions.TransactionFromDateAsString != null && 
                            $scope.transactions.TransactionFromDateAsString != '')
                            $scope.loadTransactions();
                    },
                    function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadTransactions = function (): void {

            if ($scope.transactions.WorkbookId == null || $scope.transactions.WorkbookId == 0 ||
                $scope.transactions.TransactionFromDateAsString == null || $scope.transactions.TransactionFromDateAsString == '') {

                Util.showPopup($scope, 
                    'Please make sure you have chosen a workbook and specified a transaction start date.', 'Missing Parameters');
                return;
            }

            Util.showLoading($scope);

            Util.execute(function () {

                financeTransactionService.loadTransactionList(
                    $scope.transactions.WorkbookId,
                    $scope.transactions.TransactionFromDateAsString,
                    $scope.transactions.TransactionToDateAsString,
                    function (financeTransactionList: VMTx.FinanceTransaction[]) {

                        Util.hideLoading($scope);

                        $scope.transactions.FinanceTransactionList = financeTransactionList;
                        initModel();
                    },
                    function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.saveTransactions = function (): void {

            Util.showLoading($scope);

            Util.execute(function () {

                financeTransactionService.saveTransactionList($scope.transactions,
                    function (newData: VMTx.FinanceTransactionSet) {

                        $scope.transactions.FinanceTransactionList.forEach(function (x: VMTx.FinanceTransaction): void {
                            if (x.Id <= 0) x.IsMarkedForDeletion = true;
                        });

                        $scope.transactions.FinanceTransactionList = $scope.transactions.FinanceTransactionList.filter(
                            function (x: VMTx.FinanceTransaction): bool {
                            return !x.IsMarkedForDeletion;
                        });

                        newData.FinanceTransactionList.forEach(function (x: VMTx.FinanceTransaction): void {
                            $scope.transactions.FinanceTransactionList.push(x);
                        });

                        initModel();
                        Util.hideLoading($scope);

                        Util.showPopup($scope, 'Transactions were saved successfully.', 'Saved');
                    },
                    function (errorMessage: string) {
                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getTransactionList = function (): VMTx.FinanceTransaction[] {

            var resultList: VMTx.FinanceTransaction[] = $scope.transactions.FinanceTransactionList;

            if ($scope.transactions.FilterVendorId != 0 && $scope.transactions.FilterVendorId != null) {
                resultList = resultList.filter(function (x: VMTx.FinanceTransaction) {
                    return x.VendorId == $scope.transactions.FilterVendorId;
                });
            }

            if ($scope.transactions.FilterBudgetHeadingTypeId != 0 && $scope.transactions.FilterBudgetHeadingTypeId != null) {
                resultList = resultList.filter(function (x: VMTx.FinanceTransaction) {
                    return x.BudgetHeadingTypeId == $scope.transactions.FilterBudgetHeadingTypeId;
                });
            }

            if ($scope.transactions.FilterBudgetHeadingId != 0 && $scope.transactions.FilterBudgetHeadingId != null) {
                resultList = resultList.filter(function (x: VMTx.FinanceTransaction) {
                    return x.BudgetHeadingId == $scope.transactions.FilterBudgetHeadingId;
                });
            }

            if ($scope.transactions.FilterNotes != '' && $scope.transactions.FilterNotes != null) {
                resultList = resultList.filter(function (x: VMTx.FinanceTransaction) {
                    return x.Notes.toLowerCase().indexOf($scope.transactions.FilterNotes.toLowerCase()) >= 0;
                });
            }

            return resultList;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.addTransaction = function (): void {

            var tx = new VMTx.FinanceTransaction();
            tx.Id = $scope.newTransactionId;
            $scope.newTransactionId--;
            $scope.transactions.FinanceTransactionList.push(tx);
            addWatches();
            $scope.selectTransaction(tx.Id);
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.formatAmount = function (transaction: VMTx.FinanceTransaction) {

            var amount: number = parseFloat(transaction.AmountAsString.trim().replace('$', '').replace(',', ''));
            if (isNaN(amount)) amount = 0;

            transaction.AmountAsString = $filter('currency')(amount);
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.selectTransaction = function (id: number): void {

            $scope.selectedTransaction = $scope.transactions.FinanceTransactionList
                .filter(function (x: VMTx.FinanceTransaction) {

                    return x.Id == id;
                })[0];
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getSelectedBudgetHeadingTypeId = function (): number {
            var tx: VMTx.FinanceTransaction = $scope.selectedTransaction;

            if (tx == null) return 0;            

            return tx.BudgetHeadingTypeId;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.getSelectedVendorId = function (): number {
            var tx: VMTx.FinanceTransaction = $scope.selectedTransaction;

            if (tx == null) return 0;            

            return tx.VendorId;
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('LoadWorkbook', function (event, workbookId: number) {
            $scope.transactions.WorkbookId = workbookId;
            $scope.workbookHasChanged = true;
            if ($scope.isTabActive) $scope.loadLookup();
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('TabSelected', function (event, tab: string) {
            $scope.isTabActive = (tab == 'Transactions');
            if ($scope.isTabActive && $scope.workbookHasChanged) $scope.loadLookup();
        });

        //----------------------------------------------------------------------------------------------------------------------

        initModel();
        $scope.$emit('CheckWorkbooks');
    }]);