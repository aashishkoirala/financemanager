var AK;
(function (AK) {
    (function (FinanceManager) {
        (function (Web) {
            var Resources = (function () {
                function Resources() { }
                Resources.Workbook = 'Workbook';
                Resources.FinanceTransactionSet = 'FinanceTransactionSet';
                Resources.FinanceTransactionSetLookup = 'FinanceTransactionSetLookup';
                Resources.Budget = 'Budget';
                Resources.BudgetList = 'BudgetList';
                Resources.create = function ($resource, resourceName) {
                    switch(resourceName) {
                        case Resources.Workbook: {
                            return $resource(financeManagerApiRoot + 'Workbook', {
                            }, {
                                getList: {
                                    method: 'GET',
                                    isArray: true
                                }
                            });

                        }
                        case Resources.FinanceTransactionSet: {
                            return $resource(financeManagerApiRoot + 'FinanceTransactionSet/:workbookId/:transactionDateFrom/:transactionDateTo', {
                                workbookId: '@workbookId',
                                transactionDateFrom: '@transactionDateFrom',
                                transactionDateTo: '@transactionDateTo'
                            }, {
                                update: {
                                    method: 'PUT'
                                }
                            });

                        }
                        case Resources.FinanceTransactionSetLookup: {
                            return $resource(financeManagerApiRoot + 'FinanceTransactionSetLookup/:id', {
                                id: '@id'
                            });

                        }
                        case Resources.Budget: {
                            return $resource(financeManagerApiRoot + 'Budget/:id', {
                                id: '@id'
                            }, {
                                update: {
                                    method: 'PUT'
                                }
                            });

                        }
                        case Resources.BudgetList: {
                            return $resource(financeManagerApiRoot + 'BudgetList/:id', {
                                id: '@id'
                            });

                        }
                    }
                    return null;
                };
                return Resources;
            })();
            Web.Resources = Resources;            
        })(FinanceManager.Web || (FinanceManager.Web = {}));
        var Web = FinanceManager.Web;
    })(AK.FinanceManager || (AK.FinanceManager = {}));
    var FinanceManager = AK.FinanceManager;
})(AK || (AK = {}));
