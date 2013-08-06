/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.services.workbook-service
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
/// <reference path='../resources.ts' />
/// <reference path='services.ts' />

module AK.FinanceManager.Web.Services {

    export class WorkbookService {

        workbookResource = null;

        //----------------------------------------------------------------------------------------------------------------------
    
        constructor(resource) {
            this.workbookResource = Resources.create(resource, Resources.Workbook);
        }

        //----------------------------------------------------------------------------------------------------------------------
    
        loadWorkbookList(
            success: (lookupData: any) => void ,
            error: (errorMessage: string) => void ): void {

            var workbookList = this.workbookResource.getList({},
                function () {
                    success(workbookList);
                }, function (response) {
                    error(response.data.Message);
                });
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------
    
financeManagerServices.factory('workbookService', function ($resource): Svc.WorkbookService {
    return new Svc.WorkbookService($resource);
});