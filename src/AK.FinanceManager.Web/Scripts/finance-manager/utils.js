var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (Utilities) {
                Utilities.formatDate = function (date) {
                    var dd = date.getDate();
                    var ddText = dd.toString();
                    if(dd < 10) {
                        ddText = '0' + ddText;
                    }
                    var mm = date.getMonth() + 1;
                    var mmText = mm.toString();
                    if(mm < 10) {
                        mmText = '0' + mmText;
                    }
                    var yyyy = date.getFullYear().toString();
                    return yyyy + '-' + mmText + '-' + ddText;
                };
                Utilities.showLoading = function ($scope) {
                    $scope.$emit('ShowLoading');
                };
                Utilities.hideLoading = function ($scope) {
                    $scope.$emit('HideLoading');
                };
                Utilities.showPopup = function ($scope, message, header) {
                    $scope.$emit('ShowPopup', {
                        message: message,
                        header: header
                    });
                };
                Utilities.execute = function (action) {
                    setTimeout(action, 1000);
                };
            })(Web.Utilities || (Web.Utilities = {}));
            var Utilities = Web.Utilities;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
var Util = AK.FinanceManager.Web.Utilities;
