var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Controllers) {
                var WorkbookControllerScope = (function () {
                    function WorkbookControllerScope() {
                        this.workbooks = null;
                        this.showGeneralModal = false;
                        this.showLoadingModal = false;
                        this.generalModalMessage = '';
                        this.generalModalHeader = '';
                        this.selectedTab = 'Transactions';
                        this.$watch = function (expression, callback) {
                        };
                        this.$broadcast = function (name) {
                        };
                        this.$on = function (name, callback) {
                        };
                    }
                    WorkbookControllerScope.prototype.loadWorkbookList = function () {
                    };
                    WorkbookControllerScope.prototype.loadWorkbook = function (id) {
                    };
                    WorkbookControllerScope.prototype.selectTab = function (tab) {
                    };
                    return WorkbookControllerScope;
                })();
                Controllers.WorkbookControllerScope = WorkbookControllerScope;                
                ; ;
            })(Web.Controllers || (Web.Controllers = {}));
            var Controllers = Web.Controllers;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
var Ctrl = AK.FinanceManager.Web.Controllers;
var workbookController = financeManagerApp.controller('workbookCtrl', [
    '$scope', 
    '$rootScope', 
    'workbookService', 
    function ($scope, $rootScope, workbookService) {
        $scope.showGeneralModal = false;
        $scope.showLoadingModal = false;
        $scope.workbooks = new VMWb.WorkbookSet();
        $scope.selectedTab = 'Transactions';
        $scope.loadWorkbookList = function () {
            Util.showLoading($scope);
            $scope.workbooks.WorkbookList = [];
            Util.execute(function () {
                workbookService.loadWorkbookList(function (workbookList) {
                    Util.hideLoading($scope);
                    $scope.workbooks.WorkbookList = workbookList;
                    if($scope.workbooks.WorkbookList.length > 0) {
                        $scope.loadWorkbook($scope.workbooks.WorkbookList[0].Id);
                    }
                }, function (errorMessage) {
                    Util.hideLoading($scope);
                    Util.showPopup($scope, errorMessage, 'Error');
                });
            });
        };
        $scope.loadWorkbook = function (id) {
            $scope.workbooks.SelectedWorkbookId = id;
            $scope.workbooks.SelectedWorkbookName = $scope.workbooks.WorkbookList.filter(function (x) {
                return x.Id == id;
            })[0].Name;
            $rootScope.$broadcast('LoadWorkbook', id);
        };
        $scope.selectTab = function (tab) {
            if($scope.selectedTab == tab) {
                return;
            }
            $scope.selectedTab = tab;
            $rootScope.$broadcast('TabSelected', tab);
        };
        $scope.$on('ShowLoading', function () {
            $scope.showLoadingModal = true;
        });
        $scope.$on('HideLoading', function () {
            $scope.showLoadingModal = false;
        });
        $scope.$on('ShowPopup', function (event, args) {
            $scope.generalModalMessage = args.message;
            $scope.generalModalHeader = args.header;
            $scope.showGeneralModal = true;
        });
        $scope.$on('CheckWorkbooks', function () {
            if($scope.workbooks.WorkbookList.length > 0) {
                $scope.loadWorkbook($scope.workbooks.WorkbookList[0].Id);
            }
        });
        $scope.loadWorkbookList();
    }]);
