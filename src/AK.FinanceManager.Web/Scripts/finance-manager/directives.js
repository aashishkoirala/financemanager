var financeManagerDirectives = angular.module('financeManagerDirectives', []);
financeManagerDirectives.directive('akBlur', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('blur', function () {
                scope.$apply(attrs.akBlur);
            });
        }
    };
});
financeManagerDirectives.directive('akFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('focus', function () {
                scope.$apply(attrs.akFocus);
            });
        }
    };
});
financeManagerDirectives.directive('akAutoSelect', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('focus', function () {
                element.select();
            });
        }
    };
});
financeManagerDirectives.directive('akModal', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.akModal, function (value) {
                if(value) {
                    element.modal('show');
                } else {
                    element.modal('hide');
                }
            });
        }
    };
});
