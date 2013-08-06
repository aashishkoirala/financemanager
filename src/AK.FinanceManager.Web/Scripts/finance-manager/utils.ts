/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.utils
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

module AK.FinanceManager.Web.Utilities {
    export var formatDate = function (date: Date): string {
        var dd = date.getDate();
        var ddText = dd.toString();
        if (dd < 10) ddText = '0' + ddText;
        var mm = date.getMonth() + 1;
        var mmText = mm.toString();
        if (mm < 10) mmText = '0' + mmText;
        var yyyy = date.getFullYear().toString();
        return yyyy + '-' + mmText + '-' + ddText;
    };

    //--------------------------------------------------------------------------------------------------------------------------
    
    export var showLoading = function ($scope: any): void {
        $scope.$emit('ShowLoading');
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export var hideLoading = function ($scope: any): void {
        $scope.$emit('HideLoading');
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export var showPopup = function ($scope: any, message: string, header: string): void {
        $scope.$emit('ShowPopup', { message: message, header: header });
    };

    //--------------------------------------------------------------------------------------------------------------------------
    
    export var execute = function (action: any): void {
        setTimeout(action, 1000);
    };
}

//------------------------------------------------------------------------------------------------------------------------------
    
import Util = AK.FinanceManager.Web.Utilities;