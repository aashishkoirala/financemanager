var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Controllers) {
                var TransactionControllerScope = (function () {
                    function TransactionControllerScope() {
                        this.transactions = null;
                        this.sortBy = '';
                        this.sortByReverse = false;
                        this.selectedTransaction = null;
                        this.isTabActive = false;
                        this.workbookHasChanged = false;
                        this.newTransactionId = 0;
                    }
                    TransactionControllerScope.prototype.loadLookup = function () {
                    };
                    TransactionControllerScope.prototype.loadTransactions = function () {
                    };
                    TransactionControllerScope.prototype.saveTransactions = function () {
                    };
                    TransactionControllerScope.prototype.getTransactionList = function () {
                        return null;
                    };
                    TransactionControllerScope.prototype.addTransaction = function () {
                    };
                    TransactionControllerScope.prototype.formatAmount = function (transaction) {
                    };
                    TransactionControllerScope.prototype.selectTransaction = function (id) {
                    };
                    TransactionControllerScope.prototype.getSelectedBudgetHeadingTypeId = function () {
                        return 0;
                    };
                    TransactionControllerScope.prototype.getSelectedVendorId = function () {
                        return 0;
                    };
                    TransactionControllerScope.prototype.$watch = function (expression, callback) {
                    };
                    TransactionControllerScope.prototype.$on = function (name, callback) {
                    };
                    TransactionControllerScope.prototype.$emit = function (name) {
                    };
                    return TransactionControllerScope;
                })();
                Controllers.TransactionControllerScope = TransactionControllerScope;                
            })(Web.Controllers || (Web.Controllers = {}));
            var Controllers = Web.Controllers;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
workbookController.controller('transactionCtrl', [
    '$scope', 
    '$filter', 
    'financeTransactionService', 
    function ($scope, $filter, financeTransactionService) {
        $scope.transactions = new VMTx.FinanceTransactionSet();
        $scope.sortBy = 'TransactionDateAsString';
        $scope.sortByReverse = true;
        $scope.selectedTransaction = null;
        $scope.isTabActive = true;
        $scope.workbookHasChanged = false;
        $scope.newTransactionId = -1;
        var updateBudgetHeadingTypeIds = function (transaction) {
            if (typeof transaction === "undefined") { transaction = null; }
            var list = transaction != null ? [
                transaction
            ] : $scope.transactions.FinanceTransactionList;
            list.forEach(function (x) {
                var matchingBudgetHeadingTypeList = $scope.transactions.BudgetHeadingTypeList.filter(function (y) {
                    return y.BudgetHeadingList.some(function (z) {
                        return z.Id == x.BudgetHeadingId;
                    });
                });
                if(matchingBudgetHeadingTypeList.length > 0) {
                    x.BudgetHeadingTypeId = matchingBudgetHeadingTypeList[0].Id;
                    x.BudgetHeadingList = matchingBudgetHeadingTypeList[0].BudgetHeadingList;
                }
            });
        };
        var addWatches = function () {
            $scope.$watch('getSelectedBudgetHeadingTypeId()', function (newValue, oldValue) {
                if(newValue == oldValue) {
                    return;
                }
                var tx = $scope.selectedTransaction;
                if(tx == null) {
                    return;
                }
                if(oldValue == tx.BudgetHeadingTypeId) {
                    return;
                }
                tx.BudgetHeadingList = [];
                if(tx.BudgetHeadingTypeId == null || tx.BudgetHeadingTypeId == 0) {
                    return;
                }
                tx.BudgetHeadingList = $scope.transactions.BudgetHeadingTypeList.filter(function (y) {
                    return y.Id == tx.BudgetHeadingTypeId;
                })[0].BudgetHeadingList;
            });
            $scope.$watch('getSelectedVendorId()', function (newValue, oldValue) {
                if(newValue == oldValue) {
                    return;
                }
                var tx = $scope.selectedTransaction;
                if(tx == null) {
                    return;
                }
                if(oldValue == tx.VendorId) {
                    return;
                }
                var matchingVendorList = $scope.transactions.VendorList.filter(function (x) {
                    return x.Id == tx.VendorId;
                });
                if(matchingVendorList.length == 0) {
                    return;
                }
                var matchingBudgetHeadingList = matchingVendorList[0].BudgetHeadingList;
                if(matchingBudgetHeadingList.length == 0) {
                    return;
                }
                var matchingBudgetHeadingId = matchingBudgetHeadingList[0].Id;
                if(tx.BudgetHeadingId == matchingBudgetHeadingId) {
                    return;
                }
                tx.BudgetHeadingId = matchingBudgetHeadingId;
                updateBudgetHeadingTypeIds(tx);
            });
            $scope.$watch('transactions.FilterBudgetHeadingTypeId', function (newValue, oldValue) {
                if(newValue == oldValue) {
                    return;
                }
                if(newValue == null || newValue == 0) {
                    $scope.transactions.FilterBudgetHeadingList = [];
                    return;
                }
                $scope.transactions.FilterBudgetHeadingList = $scope.transactions.BudgetHeadingTypeList.filter(function (y) {
                    return y.Id == newValue;
                })[0].BudgetHeadingList;
            });
        };
        var initModel = function () {
            updateBudgetHeadingTypeIds();
            addWatches();
        };
        $scope.loadLookup = function () {
            Util.showLoading($scope);
            $scope.transactions.BudgetHeadingTypeList = [];
            $scope.transactions.VendorList = [];
            $scope.transactions.FinanceTransactionList = [];
            $scope.workbookHasChanged = false;
            Util.execute(function () {
                financeTransactionService.loadTransactionListLookup($scope.transactions.WorkbookId, function (lookupData) {
                    Util.hideLoading($scope);
                    $scope.transactions.BudgetHeadingTypeList = lookupData.BudgetHeadingTypeList;
                    $scope.transactions.VendorList = lookupData.VendorList;
                    $scope.transactions.TransactionFromDateAsString = lookupData.DefaultTransactionFromDateAsString;
                    $scope.transactions.TransactionToDateAsString = lookupData.DefaultTransactionToDateAsString;
                    initModel();
                    if($scope.transactions.TransactionFromDateAsString != null && $scope.transactions.TransactionFromDateAsString != '') {
                        $scope.loadTransactions();
                    }
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.loadTransactions = function () {
            if($scope.transactions.WorkbookId == null || $scope.transactions.WorkbookId == 0 || $scope.transactions.TransactionFromDateAsString == null || $scope.transactions.TransactionFromDateAsString == '') {
                Util.showPopup($scope, 'Please make sure you have chosen a workbook and specified a transaction start date.', 'Missing Parameters');
                return;
            }
            Util.showLoading($scope);
            Util.execute(function () {
                financeTransactionService.loadTransactionList($scope.transactions.WorkbookId, $scope.transactions.TransactionFromDateAsString, $scope.transactions.TransactionToDateAsString, function (financeTransactionList) {
                    Util.hideLoading($scope);
                    $scope.transactions.FinanceTransactionList = financeTransactionList;
                    initModel();
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.saveTransactions = function () {
            Util.showLoading($scope);
            Util.execute(function () {
                financeTransactionService.saveTransactionList($scope.transactions, function (newData) {
                    $scope.transactions.FinanceTransactionList.forEach(function (x) {
                        if(x.Id <= 0) {
                            x.IsMarkedForDeletion = true;
                        }
                    });
                    $scope.transactions.FinanceTransactionList = $scope.transactions.FinanceTransactionList.filter(function (x) {
                        return !x.IsMarkedForDeletion;
                    });
                    newData.FinanceTransactionList.forEach(function (x) {
                        $scope.transactions.FinanceTransactionList.push(x);
                    });
                    initModel();
                    Util.hideLoading($scope);
                    Util.showPopup($scope, 'Transactions were saved successfully.', 'Saved');
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.getTransactionList = function () {
            var resultList = $scope.transactions.FinanceTransactionList;
            if($scope.transactions.FilterVendorId != 0 && $scope.transactions.FilterVendorId != null) {
                resultList = resultList.filter(function (x) {
                    return x.VendorId == $scope.transactions.FilterVendorId;
                });
            }
            if($scope.transactions.FilterBudgetHeadingTypeId != 0 && $scope.transactions.FilterBudgetHeadingTypeId != null) {
                resultList = resultList.filter(function (x) {
                    return x.BudgetHeadingTypeId == $scope.transactions.FilterBudgetHeadingTypeId;
                });
            }
            if($scope.transactions.FilterBudgetHeadingId != 0 && $scope.transactions.FilterBudgetHeadingId != null) {
                resultList = resultList.filter(function (x) {
                    return x.BudgetHeadingId == $scope.transactions.FilterBudgetHeadingId;
                });
            }
            if($scope.transactions.FilterNotes != '' && $scope.transactions.FilterNotes != null) {
                resultList = resultList.filter(function (x) {
                    return x.Notes.toLowerCase().indexOf($scope.transactions.FilterNotes.toLowerCase()) >= 0;
                });
            }
            return resultList;
        };
        $scope.addTransaction = function () {
            var tx = new VMTx.FinanceTransaction();
            tx.Id = $scope.newTransactionId;
            $scope.newTransactionId--;
            $scope.transactions.FinanceTransactionList.push(tx);
            addWatches();
            $scope.selectTransaction(tx.Id);
        };
        $scope.formatAmount = function (transaction) {
            var amount = parseFloat(transaction.AmountAsString.trim().replace('$', '').replace(',', ''));
            if(isNaN(amount)) {
                amount = 0;
            }
            transaction.AmountAsString = $filter('currency')(amount);
        };
        $scope.selectTransaction = function (id) {
            $scope.selectedTransaction = $scope.transactions.FinanceTransactionList.filter(function (x) {
                return x.Id == id;
            })[0];
        };
        $scope.getSelectedBudgetHeadingTypeId = function () {
            var tx = $scope.selectedTransaction;
            if(tx == null) {
                return 0;
            }
            return tx.BudgetHeadingTypeId;
        };
        $scope.getSelectedVendorId = function () {
            var tx = $scope.selectedTransaction;
            if(tx == null) {
                return 0;
            }
            return tx.VendorId;
        };
        $scope.$on('LoadWorkbook', function (event, workbookId) {
            $scope.transactions.WorkbookId = workbookId;
            $scope.workbookHasChanged = true;
            if($scope.isTabActive) {
                $scope.loadLookup();
            }
        });
        $scope.$on('TabSelected', function (event, tab) {
            $scope.isTabActive = (tab == 'Transactions');
            if($scope.isTabActive && $scope.workbookHasChanged) {
                $scope.loadLookup();
            }
        });
        initModel();
        $scope.$emit('CheckWorkbooks');
    }]);
