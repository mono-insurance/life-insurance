import { useContext, useEffect, useRef, useState} from "react";
import LogoBlue from "../../../assets/images/logo_blue.svg";
import LogoWhite from "../../../assets/images/logo_white.svg";
import {
  MdOutlineCreate,
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlinePersonAdd,
  MdOutlineMoney,
  MdOutlineAdminPanelSettings,
  MdOutlinePersonAddDisabled,
  MdOutlineMoneyOff,
  MdOutlinePersonPinCircle,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { NavLink, useParams } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { SidebarContext } from "../../../context/SidebarContext";
import "./sidebar.scss";
import { fetchAdmin } from "../../../services/AdminServices";
import { errorToast } from "../../../utils/helper/toast";

export const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar, handleMenuClick, activeMenu, resetSidebar} = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const [name, setName] = useState('');
  const routeParams = useParams();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    resetSidebar();
    window.location.href = '/auth/login';
  };

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try{
        const adminData = await fetchAdmin();
        if (adminData) {
          setName(adminData.firstName+" "+adminData.lastName);
        }
      }
      catch(error){
        console.log(error)
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred while fetching admin data. Please try again later.");
        }
      }
    };
  
    fetchAdminData();
}, []);


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, []);

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={theme === "light" ? LogoBlue : LogoWhite} alt="" />
          <span className="sidebar-brand-text">{ name }</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}>
              <NavLink to={`/admin/dashboard/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('dashboard')}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'users' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('users')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCreate size={20} />
                </span>
                <span className="menu-link-text">Users</span>
              </button>
              {(activeMenu === 'users' || activeMenu === 'employees' || activeMenu === 'agents' || activeMenu === 'customers') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'employees' ? 'active' : ''}`}>
                    <button className="menu-link" onClick={() => handleMenuClick('employees')} style={{marginBottom: '6px'}}>
                      <span className="menu-link-icon">
                        <MdOutlineCreate size={20} />
                      </span>
                      <span className="menu-link-text">Employees</span>
                    </button>
                    {(activeMenu === 'employees' || activeMenu === 'add-employees' || activeMenu === 'get-employees') && (
                      <ul className="menu-list" >
                        <li className={`menu-item ${activeMenu === 'add-employees' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                          <NavLink to={`/admin/add-employees/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-employees')}>
                          <span className="menu-link-icon">
                            <MdOutlinePersonAdd size={20} />
                          </span>
                          <span className="menu-link-text">Add Employees</span>
                          </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'get-employees' ? 'active' : ''}`}>
                          <NavLink to={`/admin/get-employees/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-employees')}>
                          <span className="menu-link-icon">
                            <MdOutlinePeople size={20} />
                          </span>
                          <span className="menu-link-text">Get Employees</span>
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className={`menu-item ${activeMenu === 'agents' ? 'active' : ''}`}>
                    <button className="menu-link" onClick={() => handleMenuClick('agents')} style={{marginBottom: '6px'}}>
                      <span className="menu-link-icon">
                        <MdOutlineCreate size={20} />
                      </span>
                      <span className="menu-link-text">Agents</span>
                    </button>
                    {(activeMenu === 'agents' || activeMenu === 'add-agents' || activeMenu === 'get-agents') && (
                      <ul className="menu-list" >
                        <li className={`menu-item ${activeMenu === 'add-agents' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                          <NavLink to={`/admin/add-agents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-agents')}>
                          <span className="menu-link-icon">
                            <MdOutlinePersonAdd size={20} />
                          </span>
                          <span className="menu-link-text">Add Agents</span>
                          </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'get-agents' ? 'active' : ''}`}>
                          <NavLink to={`/admin/get-agents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-agents')}>
                          <span className="menu-link-icon">
                            <MdOutlinePeople size={20} />
                          </span>
                          <span className="menu-link-text">Get Agents</span>
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className={`menu-item ${activeMenu === 'customers' ? 'active' : ''}`}>
                    <button className="menu-link" onClick={() => handleMenuClick('customers')} style={{marginBottom: '6px'}}>
                      <span className="menu-link-icon">
                        <MdOutlineCreate size={20} />
                      </span>
                      <span className="menu-link-text">Customers</span>
                    </button>
                    {(activeMenu === 'customers' || activeMenu === 'add-customers' || activeMenu === 'get-customers') && (
                      <ul className="menu-list" >
                        <li className={`menu-item ${activeMenu === 'add-customers' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                          <NavLink to={`/admin/add-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-customers')}>
                          <span className="menu-link-icon">
                            <MdOutlinePersonAdd size={20} />
                          </span>
                          <span className="menu-link-text">Add Customers</span>
                          </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'get-customers' ? 'active' : ''}`}>
                          <NavLink to={`/admin/get-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-customers')}>
                          <span className="menu-link-icon">
                            <MdOutlinePeople size={20} />
                          </span>
                          <span className="menu-link-text">Get Customers</span>
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'locations' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('locations')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCreate size={20} />
                </span>
                <span className="menu-link-text">Locations</span>
              </button>
              {(activeMenu === 'locations' || activeMenu === 'state' || activeMenu === 'city') && (
                <ul className="menu-list" >
                <li className={`menu-item ${activeMenu === 'state' ? 'active' : ''}`}>
                  <button className="menu-link" onClick={() => handleMenuClick('state')} style={{marginBottom: '6px'}}>
                    <span className="menu-link-icon">
                      <MdOutlineCreate size={20} />
                    </span>
                    <span className="menu-link-text">State</span>
                  </button>
                  {(activeMenu === 'state' || activeMenu === 'add-state' || activeMenu === 'get-state') && (
                    <ul className="menu-list" >
                      <li className={`menu-item ${activeMenu === 'add-state' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                        <NavLink to={`/admin/add-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-state')}>
                        <span className="menu-link-icon">
                          <MdOutlinePersonAdd size={20} />
                        </span>
                        <span className="menu-link-text">Add State</span>
                        </NavLink>
                      </li>
                      <li className={`menu-item ${activeMenu === 'get-state' ? 'active' : ''}`}>
                        <NavLink to={`/admin/get-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-state')}>
                        <span className="menu-link-icon">
                          <MdOutlinePeople size={20} />
                        </span>
                        <span className="menu-link-text">Get State</span>
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li className={`menu-item ${activeMenu === 'city' ? 'active' : ''}`}>
                  <button className="menu-link" onClick={() => handleMenuClick('city')} style={{marginBottom: '6px'}}>
                    <span className="menu-link-icon">
                      <MdOutlineCreate size={20} />
                    </span>
                    <span className="menu-link-text">City</span>
                  </button>
                  {(activeMenu === 'city' || activeMenu === 'add-city' || activeMenu === 'get-city') && (
                    <ul className="menu-list" >
                      <li className={`menu-item ${activeMenu === 'add-city' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                        <NavLink to={`/admin/add-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-city')}>
                        <span className="menu-link-icon">
                          <MdOutlinePersonAdd size={20} />
                        </span>
                        <span className="menu-link-text">Add City</span>
                        </NavLink>
                      </li>
                      <li className={`menu-item ${activeMenu === 'get-city' ? 'active' : ''}`}>
                        <NavLink to={`/admin/get-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-city')}>
                        <span className="menu-link-icon">
                          <MdOutlinePeople size={20} />
                        </span>
                        <span className="menu-link-text">Get City</span>
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'customer' ? 'active' : ''}`}>
              <NavLink to={`/admin/customer/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('customer')}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Customer</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'transactions' ? 'active' : ''}`}>
              <NavLink to={`/admin/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('transactions')}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Transactions</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'actions' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('actions')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCreate size={20} />
                </span>
                <span className="menu-link-text">Actions</span>
              </button>
              {(activeMenu === 'actions' || activeMenu === 'create-admin' || activeMenu === 'create-account') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'create-admin' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/create-admin/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('create-admin')}>
                    <span className="menu-link-icon">
                      <MdOutlinePersonAdd size={20} />
                    </span>
                    <span className="menu-link-text">Create Admin</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'create-account' ? 'active' : ''}`}>
                    <NavLink to={`/admin/create-account/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('create-account')}>
                    <span className="menu-link-icon">
                      <MdOutlineMoney size={20} />
                    </span>
                    <span className="menu-link-text">Create Account</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'operations' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('operations')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineAdminPanelSettings size={20} />
                </span>
                <span className="menu-link-text">Operations</span>
              </button>
              {(activeMenu === 'operations' || activeMenu === 'inactive-customers' || activeMenu === 'inactive-accounts' || activeMenu === 'activate-customers' || activeMenu === 'activate-accounts') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'inactive-customers' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/inactive-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('inactive-customers')}>
                    <span className="menu-link-icon">
                      <MdOutlinePersonAddDisabled size={20} />
                    </span>
                    <span className="menu-link-text">Inactive Customers</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'inactive-accounts' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/inactive-accounts/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('inactive-accounts')}>
                    <span className="menu-link-icon">
                      <MdOutlineMoneyOff size={20} />
                    </span>
                    <span className="menu-link-text">Inactive Accounts</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'activate-customers' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/activate-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('activate-customers')}>
                    <span className="menu-link-icon">
                      <MdOutlinePersonPinCircle size={20} />
                    </span>
                    <span className="menu-link-text">Activate Customers</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'activate-accounts' ? 'active' : ''}`}>
                    <NavLink to={`/admin/activate-accounts/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('activate-accounts')}>
                    <span className="menu-link-icon">
                      <MdOutlineAttachMoney size={20} />
                    </span>
                    <span className="menu-link-text">Activate Accounts</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to={`/admin/settings/${routeParams.id}`} className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/auth/login" className="menu-link" activeClassName="active" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
