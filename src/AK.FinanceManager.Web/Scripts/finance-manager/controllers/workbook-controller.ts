/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.controllers.workbook-controller
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
/// <reference path='../view-models.ts' />
/// <reference path='app.ts' />
/// <reference path='../services/workbook-service.ts' />

module AK.FinanceManager.Web.Controllers {

    export class WorkbookControllerScope {
        workbooks: VMWb.WorkbookSet = null;
        showGeneralModal: bool = false;
        showLoadingModal: bool = false;
        generalModalMessage: string = '';
        generalModalHeader: string = '';
        selectedTab: string = 'Transactions';

        //----------------------------------------------------------------------------------------------------------------------

        loadWorkbookList (): void { };
        loadWorkbook(id: number): void { };
        selectTab(tab: string): void { };

        //----------------------------------------------------------------------------------------------------------------------

        $watch = function (expression: any, callback: any): void { };
        $broadcast = function (name: string): void { };
        $on = function (name: any, callback: any): void { };
    };
}

//------------------------------------------------------------------------------------------------------------------------------

import Ctrl = AK.FinanceManager.Web.Controllers;

//------------------------------------------------------------------------------------------------------------------------------

var workbookController = financeManagerApp.controller('workbookCtrl',
    ['$scope', '$rootScope', 'workbookService',
    function ($scope: Ctrl.WorkbookControllerScope, $rootScope: any, workbookService: Svc.WorkbookService) {

        $scope.showGeneralModal = false;
        $scope.showLoadingModal = false;
        $scope.workbooks = new VMWb.WorkbookSet();
        $scope.selectedTab = 'Transactions';

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadWorkbookList = function (): void {

            Util.showLoading($scope);
            $scope.workbooks.WorkbookList = [];

            Util.execute(function () {

                workbookService.loadWorkbookList(
                    function (workbookList) {

                        Util.hideLoading($scope);
                        $scope.workbooks.WorkbookList = workbookList;

                        if ($scope.workbooks.WorkbookList.length > 0)
                            $scope.loadWorkbook($scope.workbooks.WorkbookList[0].Id);
                    },
                    function (errorMessage: string) {

                        Util.hideLoading($scope);
                        Util.showPopup($scope, errorMessage, 'Error');
                    });
            });
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadWorkbook = function (id: number): void {
            $scope.workbooks.SelectedWorkbookId = id;
            $scope.workbooks.SelectedWorkbookName = $scope.workbooks.WorkbookList.filter(
                function (x: VMWb.Workbook): bool { return x.Id == id; })[0].Name;

            $rootScope.$broadcast('LoadWorkbook', id);
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.selectTab = function (tab: string): void {
            if ($scope.selectedTab == tab) return;
            $scope.selectedTab = tab;
            
            $rootScope.$broadcast('TabSelected', tab);
        };

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('ShowLoading', function (): void {
            $scope.showLoadingModal = true;
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('HideLoading', function (): void {
            $scope.showLoadingModal = false;
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('ShowPopup', function (event, args) {
            $scope.generalModalMessage = args.message;
            $scope.generalModalHeader = args.header;
            $scope.showGeneralModal = true;
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.$on('CheckWorkbooks', function (): void {
            if ($scope.workbooks.WorkbookList.length > 0)
                $scope.loadWorkbook($scope.workbooks.WorkbookList[0].Id);
        });

        //----------------------------------------------------------------------------------------------------------------------

        $scope.loadWorkbookList();
    }]);