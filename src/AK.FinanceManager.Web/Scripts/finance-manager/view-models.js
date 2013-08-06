var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (ViewModels) {
                (function (Workbooks) {
                    var WorkbookSet = (function () {
                        function WorkbookSet() {
                            this.SelectedWorkbookId = 0;
                            this.SelectedWorkbookName = '';
                            this.WorkbookList = [];
                        }
                        return WorkbookSet;
                    })();
                    Workbooks.WorkbookSet = WorkbookSet;                    
                    var Workbook = (function () {
                        function Workbook() {
                            this.Id = 0;
                            this.Name = '';
                        }
                        return Workbook;
                    })();
                    Workbooks.Workbook = Workbook;                    
                })(ViewModels.Workbooks || (ViewModels.Workbooks = {}));
                var Workbooks = ViewModels.Workbooks;
            })(Web.ViewModels || (Web.ViewModels = {}));
            var ViewModels = Web.ViewModels;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (ViewModels) {
                (function (Transactions) {
                    var FinanceTransactionSet = (function () {
                        function FinanceTransactionSet() {
                            this.WorkbookId = 0;
                            this.TransactionFromDateAsString = '';
                            this.TransactionToDateAsString = '';
                            this.VendorList = [];
                            this.BudgetHeadingTypeList = [];
                            this.FinanceTransactionList = [];
                            this.FilterVendorId = 0;
                            this.FilterBudgetHeadingTypeId = 0;
                            this.FilterBudgetHeadingId = 0;
                            this.FilterNotes = '';
                            this.FilterBudgetHeadingList = [];
                            this.GeneralMessageHeader = '';
                            this.GeneralMessageBody = '';
                        }
                        return FinanceTransactionSet;
                    })();
                    Transactions.FinanceTransactionSet = FinanceTransactionSet;                    
                    var FinanceTransaction = (function () {
                        function FinanceTransaction() {
                            this.Id = 0;
                            this.TransactionDateAsString = Web.Utilities.formatDate(new Date());
                            this.VendorId = 0;
                            this.BudgetHeadingId = 0;
                            this.AmountAsString = '';
                            this.Notes = '';
                            this.BudgetHeadingTypeId = 0;
                            this.BudgetHeadingList = [];
                            this.IsMarkedForDeletion = false;
                        }
                        return FinanceTransaction;
                    })();
                    Transactions.FinanceTransaction = FinanceTransaction;                    
                    var Vendor = (function () {
                        function Vendor() {
                            this.Id = 0;
                            this.Name = '';
                            this.BudgetHeadingList = [];
                            this.MappedNameList = [];
                        }
                        return Vendor;
                    })();
                    Transactions.Vendor = Vendor;                    
                    var BudgetHeading = (function () {
                        function BudgetHeading() {
                            this.Id = 0;
                            this.Name = '';
                        }
                        return BudgetHeading;
                    })();
                    Transactions.BudgetHeading = BudgetHeading;                    
                    var BudgetHeadingType = (function () {
                        function BudgetHeadingType() {
                            this.Id = 0;
                            this.Name = '';
                            this.BudgetHeadingList = [];
                        }
                        return BudgetHeadingType;
                    })();
                    Transactions.BudgetHeadingType = BudgetHeadingType;                    
                    var Budget = (function () {
                        function Budget() {
                            this.Id = 0;
                            this.WorkbookId = 0;
                            this.PeriodStartDate = null;
                            this.PeriodEndDate = null;
                            this.BudgetItemList = [];
                        }
                        return Budget;
                    })();
                    Transactions.Budget = Budget;                    
                    var BudgetItem = (function () {
                        function BudgetItem() {
                            this.Id = 0;
                            this.BudgetHeadingId = 0;
                            this.Amount = 0;
                        }
                        return BudgetItem;
                    })();
                    Transactions.BudgetItem = BudgetItem;                    
                })(ViewModels.Transactions || (ViewModels.Transactions = {}));
                var Transactions = ViewModels.Transactions;
            })(Web.ViewModels || (Web.ViewModels = {}));
            var ViewModels = Web.ViewModels;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            (function (ViewModels) {
                (function (Budgets) {
                    var BudgetListItem = (function () {
                        function BudgetListItem() {
                            this.Id = 0;
                            this.Name = '';
                        }
                        return BudgetListItem;
                    })();
                    Budgets.BudgetListItem = BudgetListItem;                    
                    var Budget = (function () {
                        function Budget() {
                            this.Id = 0;
                            this.WorkbookId = 0;
                            this.BudgetName = '';
                            this.BudgetItemList = [];
                            this.BudgetHeadingTypeList = [];
                            this.BudgetHeadingList = [];
                            this.FilterBudgetHeadingType = '';
                            this.FilterBudgetHeading = '';
                        }
                        return Budget;
                    })();
                    Budgets.Budget = Budget;                    
                    var BudgetItem = (function () {
                        function BudgetItem() {
                            this.Id = 0;
                            this.IsMoneyComingIn = false;
                            this.BudgetHeadingType = '';
                            this.BudgetHeading = '';
                            this.BudgetAmount = 0;
                            this.BudgetAmountAsString = '';
                            this.ActualAmount = 0;
                        }
                        return BudgetItem;
                    })();
                    Budgets.BudgetItem = BudgetItem;                    
                })(ViewModels.Budgets || (ViewModels.Budgets = {}));
                var Budgets = ViewModels.Budgets;
            })(Web.ViewModels || (Web.ViewModels = {}));
            var ViewModels = Web.ViewModels;
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
var VMWb = AK.FinanceManager.Web.ViewModels.Workbooks;
var VMTx = AK.FinanceManager.Web.ViewModels.Transactions;
var VMBu = AK.FinanceManager.Web.ViewModels.Budgets;
