var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Controllers) {
                var BudgetControllerScope = (function () {
                    function BudgetControllerScope() {
                        this.budgetList = [];
                        this.budget = null;
                        this.sortBy = '';
                        this.sortByReverse = false;
                        this.isTabActive = false;
                        this.workbookHasChanged = false;
                        this.newBudgetPeriodStartDate = '';
                        this.newBudgetPeriodEndDate = '';
                    }
                    BudgetControllerScope.prototype.loadBudgetList = function () {
                    };
                    BudgetControllerScope.prototype.loadBudget = function (id) {
                    };
                    BudgetControllerScope.prototype.saveBudget = function () {
                    };
                    BudgetControllerScope.prototype.createBudget = function () {
                    };
                    BudgetControllerScope.prototype.getBudgetItemList = function () {
                        return [];
                    };
                    BudgetControllerScope.prototype.formatAmount = function (budgetItem) {
                    };
                    BudgetControllerScope.prototype.getBudgetedInTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getBudgetedOutTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getBudgetedDiffTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getActualInTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getActualOutTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getActualDiffTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.getDiffTotal = function () {
                        return 0;
                    };
                    BudgetControllerScope.prototype.$on = function (name, callback) {
                    };
                    BudgetControllerScope.prototype.$emit = function (name) {
                    };
                    return BudgetControllerScope;
                })();
                Controllers.BudgetControllerScope = BudgetControllerScope;                
            })(Web.Controllers || (Web.Controllers = {}));
            var Controllers = Web.Controllers;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
workbookController.controller('budgetCtrl', [
    '$scope', 
    '$filter', 
    'budgetService', 
    function ($scope, $filter, budgetService) {
        $scope.budgetList = [];
        $scope.budget = new VMBu.Budget();
        $scope.sortBy = '';
        $scope.sortByReverse = false;
        $scope.isTabActive = false;
        $scope.workbookHasChanged = false;
        $scope.newBudgetPeriodStartDate = '';
        $scope.newBudgetPeriodEndDate = '';
        $scope.loadBudgetList = function () {
            $scope.workbookHasChanged = false;
            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.loadBudgetList($scope.budget.WorkbookId, function (budgetList) {
                    $scope.budgetList = budgetList;
                    Util.hideLoading($scope);
                    if($scope.budgetList.length > 0) {
                        $scope.loadBudget($scope.budgetList[0].Id);
                    }
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.loadBudget = function (id) {
            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.loadBudget(id, function (budget) {
                    Util.hideLoading($scope);
                    $scope.budget = budget;
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.saveBudget = function () {
            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.saveBudget($scope.budget, function (budget) {
                    Util.hideLoading($scope);
                    $scope.budget = budget;
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.createBudget = function () {
            Util.showLoading($scope);
            Util.execute(function () {
                budgetService.createBudget($scope.budget.WorkbookId, $scope.newBudgetPeriodStartDate, $scope.newBudgetPeriodEndDate, function (budget) {
                    Util.hideLoading($scope);
                    $scope.budget = budget;
                    var budgetListItem = new VMBu.BudgetListItem();
                    budgetListItem.Id = budget.Id;
                    budgetListItem.Name = budget.BudgetName;
                    $scope.budgetList.unshift(budgetListItem);
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.getBudgetItemList = function () {
            var list = $scope.budget.BudgetItemList;
            if($scope.budget.FilterBudgetHeadingType != null && $scope.budget.FilterBudgetHeadingType != '') {
                list = list.filter(function (x) {
                    return $scope.budget.FilterBudgetHeadingType == x.BudgetHeadingType;
                });
            }
            if($scope.budget.FilterBudgetHeading != null && $scope.budget.FilterBudgetHeading != '') {
                list = list.filter(function (x) {
                    return $scope.budget.FilterBudgetHeading == x.BudgetHeading;
                });
            }
            return list;
        };
        $scope.formatAmount = function (budgetItem) {
            var amount = parseFloat(budgetItem.BudgetAmountAsString.trim().replace('$', '').replace(',', ''));
            if(isNaN(amount)) {
                amount = 0;
            }
            budgetItem.BudgetAmount = amount;
            budgetItem.BudgetAmountAsString = $filter('currency')(amount);
        };
        $scope.getBudgetedInTotal = function () {
            var total = 0;
            $scope.budget.BudgetItemList.filter(function (x) {
                return x.IsMoneyComingIn;
            }).forEach(function (x) {
                total += x.BudgetAmount;
            });
            return total;
        };
        $scope.getBudgetedOutTotal = function () {
            var total = 0;
            $scope.budget.BudgetItemList.filter(function (x) {
                return !x.IsMoneyComingIn;
            }).forEach(function (x) {
                total += x.BudgetAmount;
            });
            return total;
        };
        $scope.getBudgetedDiffTotal = function () {
            return $scope.getBudgetedInTotal() - $scope.getBudgetedOutTotal();
        };
        $scope.getActualInTotal = function () {
            var total = 0;
            $scope.budget.BudgetItemList.filter(function (x) {
                return x.IsMoneyComingIn;
            }).forEach(function (x) {
                total += x.ActualAmount;
            });
            return total;
        };
        $scope.getActualOutTotal = function () {
            var total = 0;
            $scope.budget.BudgetItemList.filter(function (x) {
                return !x.IsMoneyComingIn;
            }).forEach(function (x) {
                total += x.ActualAmount;
            });
            return total;
        };
        $scope.getActualDiffTotal = function () {
            return $scope.getActualInTotal() - $scope.getActualOutTotal();
        };
        $scope.getDiffTotal = function () {
            return ($scope.getActualInTotal() - $scope.getActualOutTotal()) - ($scope.getBudgetedInTotal() - $scope.getBudgetedOutTotal());
        };
        $scope.$on('LoadWorkbook', function (event, workbookId) {
            $scope.budget.WorkbookId = workbookId;
            $scope.workbookHasChanged = true;
            if($scope.isTabActive) {
                $scope.loadBudgetList();
            }
        });
        $scope.$on('TabSelected', function (event, tab) {
            $scope.isTabActive = (tab == 'Budget');
            if($scope.isTabActive && $scope.workbookHasChanged) {
                $scope.loadBudgetList();
            }
        });
        $scope.$emit('CheckWorkbooks');
    }]);
