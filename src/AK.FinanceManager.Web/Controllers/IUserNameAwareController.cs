/*******************************************************************************************************************************
 * AK.FinanceManager.Web.Controllers.IUserNameAwareController
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

namespace AK.FinanceManager.Web.Controllers
{
    /// <summary>
    /// Contract implemented by user-name-aware controllers.
    /// </summary>
    /// <author>Aashish Koirala</author>
    public interface IUserNameAwareController
    {
        /// <summary>
        /// Gets or sets the user name.
        /// </summary>
        string UserName { get; set; }
    }
}