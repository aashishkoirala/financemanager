var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Services) {
                var BudgetService = (function () {
                    function BudgetService(resource) {
                        this.BudgetResource = null;
                        this.BudgetListResource = null;
                        this.BudgetResource = Web.Resources.create(resource, Web.Resources.Budget);
                        this.BudgetListResource = Web.Resources.create(resource, Web.Resources.BudgetList);
                    }
                    BudgetService.prototype.loadBudgetList = function (workbookId, success, error) {
                        var budgetList = this.BudgetListResource.query({
                            id: workbookId
                        }, function () {
                            success(budgetList);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    BudgetService.prototype.loadBudget = function (id, success, error) {
                        var budget = this.BudgetResource.get({
                            id: id
                        }, function () {
                            success(budget);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    BudgetService.prototype.saveBudget = function (budget, success, error) {
                        var transactionData = {
                            Id: budget.Id,
                            WorkbookId: budget.WorkbookId,
                            BudgetItemList: budget.BudgetItemList
                        };
                        var self = this;
                        var resource = self.BudgetResource.update(transactionData, function () {
                            success(resource);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    BudgetService.prototype.createBudget = function (workbookId, periodStartDate, periodEndDate, success, error) {
                        var transactionData = {
                            WorkbookId: workbookId,
                            PeriodStartDate: periodStartDate,
                            PeriodEndDate: periodEndDate
                        };
                        var self = this;
                        var resource = self.BudgetResource.save(transactionData, function () {
                            success(resource);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    return BudgetService;
                })();
                Services.BudgetService = BudgetService;                
            })(Web.Services || (Web.Services = {}));
            var Services = Web.Services;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
financeManagerServices.factory('budgetService', function ($resource) {
    return new Svc.BudgetService($resource);
});
