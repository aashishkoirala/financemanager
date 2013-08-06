var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Services) {
                var WorkbookService = (function () {
                    function WorkbookService(resource) {
                        this.workbookResource = null;
                        this.workbookResource = Web.Resources.create(resource, Web.Resources.Workbook);
                    }
                    WorkbookService.prototype.loadWorkbookList = function (success, error) {
                        var workbookList = this.workbookResource.getList({
                        }, function () {
                            success(workbookList);
                        }, function (response) {
                            error(response.data.Message);
                        });
                    };
                    return WorkbookService;
                })();
                Services.WorkbookService = WorkbookService;                
            })(Web.Services || (Web.Services = {}));
            var Services = Web.Services;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
financeManagerServices.factory('workbookService', function ($resource) {
    return new Svc.WorkbookService($resource);
});
