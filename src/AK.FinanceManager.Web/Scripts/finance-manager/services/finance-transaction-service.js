var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Services) {
                var FinanceTransactionService = (function () {
                    function FinanceTransactionService(resource) {
                        this.financeTransactionSetLookupResource = null;
                        this.financeTransactionSetResource = null;
                        this.financeTransactionSetLookupResource = Web.Resources.create(resource, Web.Resources.FinanceTransactionSetLookup);
                        this.financeTransactionSetResource = Web.Resources.create(resource, Web.Resources.FinanceTransactionSet);
                    }
                    FinanceTransactionService.prototype.loadTransactionListLookup = function (workbookId, success, error) {
                        var financeTransactionSetLookup = this.financeTransactionSetLookupResource.get({
                            id: workbookId
                        }, function () {
                            success(financeTransactionSetLookup);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    FinanceTransactionService.prototype.loadTransactionList = function (workbookId, transactionFromDateAsString, transactionToDateAsString, success, error) {
                        var financeTransactionSet = this.financeTransactionSetResource.get({
                            workbookId: workbookId,
                            transactionDateFrom: transactionFromDateAsString,
                            transactionDateTo: transactionToDateAsString
                        }, function () {
                            success(financeTransactionSet.FinanceTransactionList);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    FinanceTransactionService.prototype.saveTransactionList = function (financeTransactionSet, success, error) {
                        var transactionData = {
                            WorkbookId: financeTransactionSet.WorkbookId,
                            TransactionFromDateAsString: financeTransactionSet.TransactionFromDateAsString,
                            TransactionToDateAsString: financeTransactionSet.TransactionToDateAsString,
                            FinanceTransactionList: financeTransactionSet.FinanceTransactionList
                        };
                        var self = this;
                        self.financeTransactionSetResource.update(transactionData, function () {
                            var resource = self.financeTransactionSetResource.save(transactionData, function () {
                                success(resource);
                            }, function (response) {
                                error(response.data.Message);
                            });
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    return FinanceTransactionService;
                })();
                Services.FinanceTransactionService = FinanceTransactionService;                
            })(Web.Services || (Web.Services = {}));
            var Services = Web.Services;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
financeManagerServices.factory('financeTransactionService', function ($resource) {
    return new Svc.FinanceTransactionService($resource);
});
