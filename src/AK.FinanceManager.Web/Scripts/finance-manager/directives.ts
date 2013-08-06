/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.directives
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

/// <reference path='../angular-1.0.d.ts' />

var financeManagerDirectives: ng.IModule = angular.module('financeManagerDirectives', []);

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerDirectives.directive('akBlur', function (): any {
    return {
        restrict: 'A',
        link: function (scope, element, attrs): void {
            element.bind('blur', function () {
                scope.$apply(attrs.akBlur);
            });
        }
    };
});

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerDirectives.directive('akFocus', function (): any {
    return {
        restrict: 'A',
        link: function (scope, element, attrs): void {
            element.bind('focus', function () {
                scope.$apply(attrs.akFocus);
            });
        }
    };
});

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerDirectives.directive('akAutoSelect', function (): any {
    return {
        restrict: 'A',
        link: function (scope, element, attrs): void {
            element.bind('focus', function () {
                element.select();
            });
        }
    };
});

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerDirectives.directive('akModal', function (): any {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.akModal, function (value: bool) {
                if (value) element.modal('show');
                else element.modal('hide');
            });
        }
    };
});