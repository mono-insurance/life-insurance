import { useContext, useEffect, useRef, useState} from "react";
import LogoBlue from "../../../assets/images/logo_blue.svg";
import LogoWhite from "../../../assets/images/logo_white.svg";
import {
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineSettings,
  MdOutlinePersonAdd,
  MdOutlineMoney,
  MdOutlinePeople,
  MdOutlinePerson,
  MdOutlinePerson2,
  MdOutlinePerson4,
  MdOutlineLocationCity,
  MdOutlineShareLocation,
  MdOutlineMyLocation,
  MdOutlineAddLocation,
  MdOutlineEditLocation,
  MdOutlineCategory,
  MdOutlineAddTask,
  MdOutlineRemoveCircle,
  MdOutlinePolicy,
  MdOutlineCancel,
  MdOutlineRequestQuote,
  MdOutlineCurrencyBitcoin,
  MdOutlineFeedback,
  MdOutlineQuestionMark,
  MdOutlineMonetizationOn,
  MdOutlineAdminPanelSettings,
  MdOutlineMoneyOff,
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
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Users</span>
              </button>
              {(activeMenu === 'users' || activeMenu === 'employees' || activeMenu === 'agents' || activeMenu === 'customers') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'employees' ? 'active' : ''}`}>
                    <button className="menu-link" onClick={() => handleMenuClick('employees')} style={{marginBottom: '6px'}}>
                      <span className="menu-link-icon">
                        <MdOutlinePerson4 size={20} />
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
                        <MdOutlinePerson2 size={20} />
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
                        <MdOutlinePerson size={20} />
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
                  <MdOutlineMyLocation size={20} />
                </span>
                <span className="menu-link-text">Locations</span>
              </button>
              {(activeMenu === 'locations' || activeMenu === 'state' || activeMenu === 'city') && (
                <ul className="menu-list" >
                <li className={`menu-item ${activeMenu === 'state' ? 'active' : ''}`}>
                  <button className="menu-link" onClick={() => handleMenuClick('state')} style={{marginBottom: '6px'}}>
                    <span className="menu-link-icon">
                      <MdOutlineShareLocation size={20} />
                    </span>
                    <span className="menu-link-text">State</span>
                  </button>
                  {(activeMenu === 'state' || activeMenu === 'add-state' || activeMenu === 'get-state') && (
                    <ul className="menu-list" >
                      <li className={`menu-item ${activeMenu === 'add-state' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                        <NavLink to={`/admin/add-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-state')}>
                        <span className="menu-link-icon">
                          <MdOutlineAddLocation size={20} />
                        </span>
                        <span className="menu-link-text">Add State</span>
                        </NavLink>
                      </li>
                      <li className={`menu-item ${activeMenu === 'get-state' ? 'active' : ''}`}>
                        <NavLink to={`/admin/get-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-state')}>
                        <span className="menu-link-icon">
                          <MdOutlineEditLocation size={20} />
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
                      <MdOutlineLocationCity size={20} />
                    </span>
                    <span className="menu-link-text">City</span>
                  </button>
                  {(activeMenu === 'city' || activeMenu === 'add-city' || activeMenu === 'get-city') && (
                    <ul className="menu-list" >
                      <li className={`menu-item ${activeMenu === 'add-city' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                        <NavLink to={`/admin/add-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-city')}>
                        <span className="menu-link-icon">
                          <MdOutlineAddLocation size={20} />
                        </span>
                        <span className="menu-link-text">Add City</span>
                        </NavLink>
                      </li>
                      <li className={`menu-item ${activeMenu === 'get-city' ? 'active' : ''}`}>
                        <NavLink to={`/admin/get-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-city')}>
                        <span className="menu-link-icon">
                          <MdOutlineEditLocation size={20} />
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
            <li className={`menu-item ${activeMenu === 'insurance-categories' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('insurance-categories')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCategory size={20} />
                </span>
                <span className="menu-link-text">Insurance Category</span>
              </button>
              {(activeMenu === 'insurance-categories' || activeMenu === 'add-insurance-categories' || activeMenu === 'get-insurance-categories') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'add-insurance-categories' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/add-insurance-categories/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-insurance-categories')}>
                    <span className="menu-link-icon">
                      <MdOutlineAddTask size={20} />
                    </span>
                    <span className="menu-link-text">Add Category</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'get-insurance-categories' ? 'active' : ''}`}>
                    <NavLink to={`/admin/get-insurance-categories/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-insurance-categories')}>
                    <span className="menu-link-icon">
                      <MdOutlineRemoveCircle size={20} />
                    </span>
                    <span className="menu-link-text">Get Category</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'policy' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('policy')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlinePolicy size={20} />
                </span>
                <span className="menu-link-text">Policy</span>
              </button>
              {(activeMenu === 'policy' || activeMenu === 'add-policy' || activeMenu === 'get-policy') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'add-policy' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/add-policy/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('add-policy')}>
                    <span className="menu-link-icon">
                      <MdOutlineAddTask size={20} />
                    </span>
                    <span className="menu-link-text">Add Policy</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'get-policy' ? 'active' : ''}`}>
                    <NavLink to={`/admin/get-policy/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-policy')}>
                    <span className="menu-link-icon">
                      <MdOutlineRemoveCircle size={20} />
                    </span>
                    <span className="menu-link-text">Get Policy</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'cash-operations' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('cash-operations')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={20} />
                </span>
                <span className="menu-link-text">Cash Operations</span>
              </button>
              {(activeMenu === 'cash-operations' || activeMenu === 'commission' || activeMenu === 'claim' || activeMenu === 'cancel' || activeMenu === 'requests' || activeMenu === 'transactions') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'commission' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/commission/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('commission')}>
                    <span className="menu-link-icon">
                      <MdOutlineCurrencyBitcoin size={20} />
                    </span>
                    <span className="menu-link-text">Commission</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'claim' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/claim/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('claim')}>
                    <span className="menu-link-icon">
                      <MdOutlineAttachMoney size={20} />
                    </span>
                    <span className="menu-link-text">Claim</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'cancel' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/cancel/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('cancel')}>
                    <span className="menu-link-icon">
                      <MdOutlineCancel size={20} />
                    </span>
                    <span className="menu-link-text">Cancel</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'requests' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/requests/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('requests')}>
                    <span className="menu-link-icon">
                      <MdOutlineRequestQuote size={20} />
                    </span>
                    <span className="menu-link-text">Requests</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'transactions' ? 'active' : ''}`}>
                    <NavLink to={`/admin/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('transactions')}>
                    <span className="menu-link-icon">
                      <MdOutlineMoney size={18} />
                    </span>
                    <span className="menu-link-text">Transactions</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'feedback' ? 'active' : ''}`}>
              <NavLink to={`/admin/feedback/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('feedback')}>
                <span className="menu-link-icon">
                  <MdOutlineFeedback size={20} />
                </span>
                <span className="menu-link-text">Feedback</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'queries' ? 'active' : ''}`}>
              <NavLink to={`/admin/queries/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('queries')}>
                <span className="menu-link-icon">
                  <MdOutlineQuestionMark size={18} />
                </span>
                <span className="menu-link-text">Query</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'global-settings' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('global-settings')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineAdminPanelSettings size={20} />
                </span>
                <span className="menu-link-text">Global Settings</span>
              </button>
              {(activeMenu === 'global-settings' || activeMenu === 'tax-settings' || activeMenu === 'insurance-settings') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'tax-settings' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/admin/tax-settings/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('tax-settings')}>
                    <span className="menu-link-icon">
                      <MdOutlineMonetizationOn size={20} />
                    </span>
                    <span className="menu-link-text">Tax Settings</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'insurance-settings' ? 'active' : ''}`}>
                    <NavLink to={`/admin/insurance-settings/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('insurance-settings')}>
                    <span className="menu-link-icon">
                      <MdOutlineMoneyOff size={20} />
                    </span>
                    <span className="menu-link-text">Insurance Settings</span>
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
