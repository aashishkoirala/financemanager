/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Scripts.finance-manager.view-models
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
/// <reference path='utils.ts' />

module AK.FinanceManager.Web.ViewModels.Workbooks {

    export class WorkbookSet {
        SelectedWorkbookId: number = 0;
        SelectedWorkbookName: string = '';
        WorkbookList: Workbook[] = [];
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class Workbook {
        Id: number = 0;
        Name: string = '';
    }
}

//------------------------------------------------------------------------------------------------------------------------------

module AK.FinanceManager.Web.ViewModels.Transactions {
    export class FinanceTransactionSet {
        WorkbookId: number = 0;
        TransactionFromDateAsString: string = '';
        TransactionToDateAsString: string = '';
        VendorList: Vendor[] = [];
        BudgetHeadingTypeList: BudgetHeadingType[] = [];
        FinanceTransactionList: FinanceTransaction[] = [];
        FilterVendorId: number = 0;
        FilterBudgetHeadingTypeId: number = 0;
        FilterBudgetHeadingId: number = 0;
        FilterNotes: string = '';
        FilterBudgetHeadingList: BudgetHeading[] = [];
        GeneralMessageHeader: string = '';
        GeneralMessageBody: string = '';
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class FinanceTransaction {
        Id: number = 0;
        TransactionDateAsString: string = Utilities.formatDate(new Date());
        VendorId: number = 0;
        BudgetHeadingId: number = 0;
        AmountAsString: string = '';
        Notes: string = '';
        BudgetHeadingTypeId: number = 0;
        BudgetHeadingList: BudgetHeading[] = [];
        IsMarkedForDeletion: bool = false;
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class Vendor {
        Id: number = 0;
        Name: string = '';
        BudgetHeadingList: BudgetHeading[] = [];
        MappedNameList: string[] = [];
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class BudgetHeading {
        Id: number = 0;
        Name: string = '';
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class BudgetHeadingType {
        Id: number = 0;
        Name: string = '';
        BudgetHeadingList: BudgetHeading[] = [];
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class Budget {
        Id: number = 0;
        WorkbookId: number = 0;
        PeriodStartDate: Date = null;
        PeriodEndDate: Date = null;
        BudgetItemList: BudgetItem[] = [];
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class BudgetItem {
        Id: number = 0;
        BudgetHeadingId: number = 0;
        Amount: number = 0;
    }
}

//------------------------------------------------------------------------------------------------------------------------------
    
module AK.FinanceManager.Web.ViewModels.Budgets {
    export class BudgetListItem {
        Id: number = 0;
        Name: string = '';
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class Budget {
        Id: number = 0;
        WorkbookId: number = 0;
        BudgetName: string = '';
        BudgetItemList: BudgetItem[] = [];
        BudgetHeadingTypeList: string[] = [];
        BudgetHeadingList: string[] = [];
        FilterBudgetHeadingType: string = '';
        FilterBudgetHeading: string = '';
    }

    //--------------------------------------------------------------------------------------------------------------------------
    
    export class BudgetItem {
        Id: number = 0;
        IsMoneyComingIn: bool = false;
        BudgetHeadingType: string = '';
        BudgetHeading: string = '';
        BudgetAmount: number = 0;
        BudgetAmountAsString: string = '';
        ActualAmount: number = 0;
    }
}

//------------------------------------------------------------------------------------------------------------------------------
    
import VMWb = AK.FinanceManager.Web.ViewModels.Workbooks;
import VMTx = AK.FinanceManager.Web.ViewModels.Transactions;
import VMBu = AK.FinanceManager.Web.ViewModels.Budgets;