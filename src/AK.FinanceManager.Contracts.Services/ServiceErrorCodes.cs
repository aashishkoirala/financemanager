﻿/*******************************************************************************************************************************
 * AK.FinanceManager.Contracts.Services.ServiceErrorCodes
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

namespace AK.FinanceManager.Contracts.Services
{
    /// <summary>
    /// Service error codes.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public enum ServiceErrorCodes
    {
        NotAuthorized,
        GetWorkbookListError,
        GetBudgetListError,
        GetBudgetError,
        UpdateBudgetError,
        CreateBudgetError,
        CreateBudgetInvalidPeriodStartDate,
        CreateBudgetOverlappingDates,
        GetFinanceTransactionSetLookupError,
        GetFinanceTransactionSetError,
        UpdateFinanceTransactionSetError
    }
}