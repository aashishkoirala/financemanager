/*******************************************************************************************************************************
 * AK.FinanceManager.DataAccess.SQL.DDL
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

 -- TODO: Extend Modeling Kit to be able to auto-generate these from model.

CREATE TABLE AppUser (
    Id INT IDENTITY(1,1) NOT NULL,
    UserName NVARCHAR(50) NOT NULL,
	CONSTRAINT PK_AppUser PRIMARY KEY (Id)
)

CREATE TABLE Workbook (
    Id INT IDENTITY(1,1) NOT NULL,
    Name NVARCHAR(50) NOT NULL,
	CONSTRAINT PK_Workbook PRIMARY KEY (Id)
)

CREATE TABLE AppUserWorkbook (
    Id INT IDENTITY(1,1) NOT NULL,
    AppUserId INT NOT NULL,
    WorkbookId INT NOT NULL,
	CONSTRAINT PK_AppUserWorkbook PRIMARY KEY (Id),
	CONSTRAINT FK_AppUserWorkbook_AppUser FOREIGN KEY (AppUserId) REFERENCES AppUser (Id),
	CONSTRAINT FK_AppUserWorkbook_Workbook FOREIGN KEY (WorkbookId) REFERENCES Workbook (Id)	
)

CREATE TABLE BudgetHeadingType (
    Id INT IDENTITY(1,1) NOT NULL,
    WorkbookId INT NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    IsMoneyComingIn BIT NOT NULL,
	CONSTRAINT PK_BudgetHeadingType PRIMARY KEY (Id),
	CONSTRAINT FK_BudgetHeadingType_Workbook FOREIGN KEY (WorkbookId) REFERENCES Workbook (Id)
)

CREATE TABLE BudgetHeading (
    Id INT IDENTITY(1,1) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    BudgetHeadingTypeId INT NOT NULL,
    IsAnnualized BIT NOT NULL,
	CONSTRAINT PK_BudgetHeading PRIMARY KEY (Id),
	CONSTRAINT FK_BudgetHeading_BudgetHeadingType FOREIGN KEY (BudgetHeadingTypeId) REFERENCES BudgetHeadingType (Id)	
)

CREATE TABLE Budget (
    Id INT IDENTITY(1,1) NOT NULL,
    WorkbookId INT NOT NULL,
    PeriodStartDate DATETIME NOT NULL,
    PeriodEndDate DATETIME NOT NULL,
	CONSTRAINT PK_Budget PRIMARY KEY (Id),
	CONSTRAINT FK_Budget_Workbook FOREIGN KEY (WorkbookId) REFERENCES Workbook (Id)
 )

CREATE TABLE BudgetItem (
    Id INT IDENTITY(1,1) NOT NULL,
    BudgetId INT NOT NULL,
    BudgetHeadingId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
	CONSTRAINT PK_BudgetItem PRIMARY KEY (Id),
	CONSTRAINT FK_BudgetItem_Budget FOREIGN KEY (BudgetId) REFERENCES Budget (Id),
	CONSTRAINT FK_BudgetItem_BudgetHeading FOREIGN KEY (BudgetHeadingId) REFERENCES BudgetHeading (Id)	
)

CREATE TABLE Vendor (
    Id INT IDENTITY(1,1) NOT NULL,
    WorkbookId INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
	CONSTRAINT PK_Vendor PRIMARY KEY (Id),
	CONSTRAINT FK_Vendor_Workbook FOREIGN KEY (WorkbookId) REFERENCES Workbook (Id)	
)

CREATE TABLE VendorBudgetHeading (
    Id INT IDENTITY(1,1) NOT NULL,
    VendorId INT NOT NULL,
    BudgetHeadingId INT NOT NULL,
    IsDefault BIT NOT NULL,
	CONSTRAINT PK_VendorBudgetHeading PRIMARY KEY (Id),
	CONSTRAINT FK_VendorBudgetHeading_Vendor FOREIGN KEY (VendorId) REFERENCES Vendor (Id),
	CONSTRAINT FK_VendorBudgetHeading_BudgetHeading FOREIGN KEY (BudgetHeadingId) REFERENCES BudgetHeading (Id)
)

CREATE TABLE VendorMapping (
    Id INT IDENTITY(1,1) NOT NULL,
    VendorId INT NOT NULL,
    MappedName NVARCHAR(255) NOT NULL,
	CONSTRAINT PK_VendorMapping PRIMARY KEY (Id),
	CONSTRAINT FK_VendorMapping_Vendor FOREIGN KEY (VendorId) REFERENCES Vendor (Id)
)

CREATE TABLE FinanceTransaction (
    Id INT IDENTITY(1,1) NOT NULL,
    WorkbookId INT NOT NULL,
    TransactionDate DATETIME NOT NULL,
    VendorId INT NOT NULL,
    BudgetHeadingId INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Notes NVARCHAR(255) NULL,
	CONSTRAINT PK_FinanceTransaction PRIMARY KEY (Id),
	CONSTRAINT FK_FinanceTransaction_Workbook FOREIGN KEY (WorkbookId) REFERENCES Workbook (Id),
	CONSTRAINT FK_FinanceTransaction_Vendor FOREIGN KEY (VendorId) REFERENCES Vendor (Id),
	CONSTRAINT FK_FinanceTransaction_BudgetHeading FOREIGN KEY (BudgetHeadingId) REFERENCES BudgetHeading (Id)
)
