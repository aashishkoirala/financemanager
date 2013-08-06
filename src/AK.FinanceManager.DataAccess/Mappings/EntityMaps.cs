/*******************************************************************************************************************************
 * AK.FinanceManager.DataAccess.Mappings.EntityMaps
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

#region Namespace Imports

using AK.FinanceManager.Contracts.DataAccess.Entities;
using FluentNHibernate.Mapping;

#endregion

namespace AK.FinanceManager.DataAccess.Mappings
{
    // TODO: Extend Modeling Kit to be able to auto-generate these from model.

    public class AppUserMap : ClassMap<AppUser>
    {
        public AppUserMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.UserName);
        }
    }

    public class WorkbookMap : ClassMap<Workbook>
    {
        public WorkbookMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.Name);
        }
    }

    public class AppUserWorkbookMap : ClassMap<AppUserWorkbook>
    {
        public AppUserWorkbookMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.References(x => x.AppUser, "AppUserId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
            this.References(x => x.Workbook, "WorkbookId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class FinanceTransactionMap : ClassMap<FinanceTransaction>
    {
        public FinanceTransactionMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.TransactionDate);
            this.Map(x => x.Amount);
            this.Map(x => x.Notes);
            this.References(x => x.BudgetHeading, "BudgetHeadingId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
            this.References(x => x.Vendor, "VendorId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
            this.References(x => x.Workbook, "WorkbookId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class VendorMap : ClassMap<Vendor>
    {
        public VendorMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.Name);
            this.References(x => x.Workbook, "WorkbookId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class BudgetHeadingMap : ClassMap<BudgetHeading>
    {
        public BudgetHeadingMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.Name);
            this.Map(x => x.IsAnnualized);
            this.Map(x => x.IsBeginningSurplus);
            this.Map(x => x.IsEndingSurplus);
            this.References(x => x.BudgetHeadingType, "BudgetHeadingTypeId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }
    
    public class VendorBudgetHeadingMap : ClassMap<VendorBudgetHeading>
    {
        public VendorBudgetHeadingMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.IsDefault);
            this.References(x => x.Vendor, "VendorId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
            this.References(x => x.BudgetHeading, "BudgetHeadingId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class BudgetHeadingTypeMap : ClassMap<BudgetHeadingType>
    {
        public BudgetHeadingTypeMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.Name);
            this.Map(x => x.IsMoneyComingIn);
            this.References(x => x.Workbook, "WorkbookId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class VendorMappingMap : ClassMap<VendorMapping>
    {
        public VendorMappingMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.MappedName);
            this.References(x => x.Vendor, "VendorId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class BudgetMap : ClassMap<Budget>
    {
        public BudgetMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.PeriodStartDate);
            this.Map(x => x.PeriodEndDate);
            this.References(x => x.Workbook, "WorkbookId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }

    public class BudgetItemMap : ClassMap<BudgetItem>
    {
        public BudgetItemMap()
        {
            this.Id(x => x.Id).UnsavedValue(0);
            this.Map(x => x.Amount);
            this.References(x => x.Budget, "BudgetId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
            this.References(x => x.BudgetHeading, "BudgetHeadingId")
                .Cascade.None()
                .LazyLoad(Laziness.False)
                .Fetch.Join();
        }
    }
}