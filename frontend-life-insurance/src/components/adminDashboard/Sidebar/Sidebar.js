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
  MdOutlinePerson3,
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
  MdOutlinePictureInPicture,
  MdOutlineRequestQuote,
  MdOutlineCurrencyBitcoin,
  MdOutlineFeedback,
  MdOutlineQuestionMark,
  MdOutlineMonetizationOn,
  MdOutlineAdminPanelSettings,
  MdOutlineMoneyOff,
  MdOutlineAttachMoney,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlineDocumentScanner,
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
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isLocationsMenuOpen, setIsLocationsMenuOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  const handleUserMenuClick = (menu) => {
    handleMenuClick(menu);
    if (menu === 'users') {
      setIsUsersMenuOpen(!isUsersMenuOpen); // Toggle the users menu
    }
  };

  const handleLocationMenuClick = (menu) => {
    handleMenuClick(menu);
    if (menu === 'locations') {
      setIsLocationsMenuOpen(!isLocationsMenuOpen); // Toggle the users menu
    }
  };

  const handleOperationMenuClick = (menu) => {
    handleMenuClick(menu);
    if (menu === 'cash-operations') {
      setIsOperationsMenuOpen(!isOperationsOpen); // Toggle the users menu
    }
  };

  const handleSettingsMenuClick = (menu) => {
    handleMenuClick(menu);
    if (menu === 'global-settings') {
      setIsSettingsMenuOpen(!isSettingsMenuOpen); // Toggle the users menu
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    resetSidebar();
    window.location.href = '/suraksha/login';
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
              <NavLink to={`/suraksha/admin/dashboard/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('dashboard')}>
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <button className={`menu-link-button flex justify-between items-center w-full ${activeMenu === 'users' || activeMenu === 'admin' || activeMenu === 'employees' || activeMenu === 'agents' || activeMenu === 'customers' ? 'active' : ''}`} onClick={() => handleUserMenuClick('users')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                <span className="menu-link-text">Users</span>
                <span className="menu-link-arrow ml-auto">
                  {isUsersMenuOpen ? (
                    <MdOutlineArrowDropUp size={30} />
                  ) : (
                    <MdOutlineArrowDropDown size={30} />
                  )}
                </span>
              </button>
              { isUsersMenuOpen && (activeMenu === 'users' || activeMenu === 'admin' || activeMenu === 'employees' || activeMenu === 'agents' || activeMenu === 'customers') && (
                <ul className="menu-list" >
                  <li className={`menu-item pl-4 ${activeMenu === 'admin' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                      <NavLink to={`/suraksha/admin/add-admin/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('admin')}>
                          <span className="menu-link-icon">
                            <MdOutlinePersonAdd size={20} />
                          </span>
                          <span className="menu-link-text">Admin</span>
                      </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'employees' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                     <NavLink to={`/suraksha/admin/get-employees/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('employees')}>
                          <span className="menu-link-icon">
                            <MdOutlinePeople size={20} />
                          </span>
                          <span className="menu-link-text">Employees</span>
                      </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'agents' ? 'active' : ''}`} style={{marginBottom: '4px'}} >
                    <NavLink to={`/suraksha/admin/get-agents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('agents')}>
                          <span className="menu-link-icon">
                            <MdOutlinePerson3 size={20} />
                          </span>
                          <span className="menu-link-text">Agents</span>
                        </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'customers' ? 'active' : ''}`} style={{marginBottom: '6px'}}>
                      <NavLink to={`/suraksha/admin/get-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('customers')}>
                          <span className="menu-link-icon">
                            <MdOutlinePerson2 size={20} />
                          </span>
                          <span className="menu-link-text">Customers</span>
                        </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'locations' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleLocationMenuClick('locations')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineMyLocation size={20} />
                </span>
                <span className="menu-link-text">Locations</span>
                  <span className="menu-link-arrow ml-auto">
                    {isLocationsMenuOpen ? (
                      <MdOutlineArrowDropUp size={30} />
                    ) : (
                      <MdOutlineArrowDropDown size={30} />
                    )}
                  </span>
                
              </button>
              {isLocationsMenuOpen && (activeMenu === 'locations' || activeMenu === 'state' || activeMenu === 'city') && (
                <ul className="menu-list" >
                <li className={`menu-item pl-4 ${activeMenu === 'state' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/suraksha/admin/get-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('state')}>
                        <span className="menu-link-icon">
                          <MdOutlineShareLocation size={20} />
                        </span>
                        <span className="menu-link-text">State</span>
                      </NavLink>
                </li>
                <li className={`menu-item pl-4 ${activeMenu === 'city' ? 'active' : ''}`}  style={{marginBottom: '6px'}}>
                  <NavLink to={`/suraksha/admin/get-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('city')}>
                        <span className="menu-link-icon">
                          <MdOutlineLocationCity size={20} />
                        </span>
                        <span className="menu-link-text">City</span>
                      </NavLink>
                </li>
              </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'insurance-categories' ? 'active' : ''}`}>
                <NavLink to={`/suraksha/admin/get-insurance-categories/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('insurance-categories')}>
                    <span className="menu-link-icon">
                      <MdOutlineCategory size={20} />
                    </span>
                    <span className="menu-link-text">Insurance Category</span>
                  </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'policy' ? 'active' : ''}`}>
                <NavLink to={`/suraksha/admin/get-policy/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('policy')}>
                    <span className="menu-link-icon">
                      <MdOutlinePolicy size={20} />
                    </span>
                    <span className="menu-link-text">Scheme</span>
                </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'cash-operations' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleOperationMenuClick('cash-operations')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={20} />
                </span>
                <span className="menu-link-text">Cash Operations</span>
                <span className="menu-link-arrow ml-auto">
                    {isOperationsOpen ? (
                      <MdOutlineArrowDropUp size={30} />
                    ) : (
                      <MdOutlineArrowDropDown size={30} />
                    )}
                  </span>
              </button>
              {isOperationsOpen && (activeMenu === 'cash-operations' || activeMenu === 'commission' || activeMenu === 'claim' || activeMenu === 'cancel' || activeMenu === 'requests' || activeMenu === 'transactions') && (
                <ul className="menu-list" >
                  <li className={`menu-item pl-4 ${activeMenu === 'commission' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/suraksha/admin/commission/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('commission')}>
                    <span className="menu-link-icon">
                      <MdOutlineCurrencyBitcoin size={20} />
                    </span>
                    <span className="menu-link-text">Commission</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'claim' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/suraksha/admin/claim/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('claim')}>
                    <span className="menu-link-icon">
                      <MdOutlineAttachMoney size={20} />
                    </span>
                    <span className="menu-link-text">Claim</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'requests' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/suraksha/admin/requests/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('requests')}>
                    <span className="menu-link-icon">
                      <MdOutlineRequestQuote size={20} />
                    </span>
                    <span className="menu-link-text">Requests</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item pl-4 ${activeMenu === 'transactions' ? 'active' : ''}`}>
                    <NavLink to={`/suraksha/admin/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('transactions')}>
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
              <NavLink to={`/suraksha/admin/feedback/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('feedback')}>
                <span className="menu-link-icon">
                  <MdOutlineFeedback size={20} />
                </span>
                <span className="menu-link-text">Feedback</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'queries' ? 'active' : ''}`}>
              <NavLink to={`/suraksha/admin/queries/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('queries')}>
                <span className="menu-link-icon">
                  <MdOutlineQuestionMark size={18} />
                </span>
                <span className="menu-link-text">Query</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'documents' ? 'active' : ''}`}>
              <NavLink to={`/suraksha/admin/documents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('documents')}>
                <span className="menu-link-icon">
                  <MdOutlineDocumentScanner size={18} />
                </span>
                <span className="menu-link-text">Douments</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'policy-accounts' ? 'active' : ''}`}>
              <NavLink to={`/suraksha/admin/policy-accounts/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('policy-accounts')}>
                <span className="menu-link-icon">
                  <MdOutlineQuestionMark size={18} />
                </span>
                <span className="menu-link-text">Policy Accounts</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'global-settings' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleSettingsMenuClick('global-settings')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineAdminPanelSettings size={20} />
                </span>
                <span className="menu-link-text">Global Settings</span>
                <span className="menu-link-arrow ml-auto">
                    {isSettingsMenuOpen ? (
                      <MdOutlineArrowDropUp size={30} />
                    ) : (
                      <MdOutlineArrowDropDown size={30} />
                    )}
                  </span>
              </button>
              {isSettingsMenuOpen && (activeMenu === 'global-settings' || activeMenu === 'tax-settings' || activeMenu === 'insurance-settings') && (
                <ul className="menu-list" >
                  <li className={`menu-item pl-4 ${activeMenu === 'tax-settings' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/suraksha/admin/tax-settings/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('tax-settings')}>
                    <span className="menu-link-icon">
                      <MdOutlineMonetizationOn size={20} />
                    </span>
                    <span className="menu-link-text">Tax Settings</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item pl-4  ${activeMenu === 'insurance-settings' ? 'active' : ''}`}>
                    <NavLink to={`/suraksha/admin/insurance-settings/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('insurance-settings')}>
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
              <NavLink to={`/suraksha/admin/profile/${routeParams.id}`} className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlinePictureInPicture size={20} />
                </span>
                <span className="menu-link-text">Profile</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/suraksha/login" className="menu-link" activeClassName="active" onClick={handleLogout}>
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
