import { useContext, useEffect, useRef, useState } from "react";
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
import "./Sidebar.scss";
import { errorToast } from "../../../utils/helper/toast";
import { fetchEmployee } from "../../../services/EmployeeServices";

export const Sidebar = () => {
    const { theme } = useContext(ThemeContext);
    const { isSidebarOpen, closeSidebar, handleMenuClick, activeMenu, resetSidebar } = useContext(SidebarContext);
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
        const fetchEmployeeData = async () => {
            try {
                const agentData = await fetchEmployee();
                if (agentData) {
                    setName(agentData.firstName + " " + agentData.lastName);
                }
            }
            catch (error) {
                console.log(error)
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An unexpected error occurred while fetching agent data. Please try again later.");
                }
            }
        };

        fetchEmployeeData();
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
                    <span className="sidebar-brand-text">{name}</span>
                </div>
                <button className="sidebar-close-btn" onClick={closeSidebar}>
                    <MdOutlineClose size={24} />
                </button>
            </div>
            <div className="sidebar-body">
                <div className="sidebar-menu">
                    <ul className="menu-list">
                        <li className={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}>
                            <NavLink to={`/employee/dashboard/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('dashboard')}>
                                <span className="menu-link-icon">
                                    <MdOutlineGridView size={18} />
                                </span>
                                <span className="menu-link-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'users' ? 'active' : ''}`}>
                            <button className="menu-link" onClick={() => handleMenuClick('users')} style={{ marginBottom: '6px' }}>
                                <span className="menu-link-icon">
                                    <MdOutlineCreate size={20} />
                                </span>
                                <span className="menu-link-text">Users</span>
                            </button>
                            {(activeMenu === 'users' || activeMenu === 'employees' || activeMenu === 'agents' || activeMenu === 'customers') && (
                                <ul className="menu-list" >

                                    <li className={`menu-item ${activeMenu === 'agents' ? 'active' : ''}`}>
                                        <NavLink to={`/employee/agents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('agents')}>
                                            <span className="menu-link-icon">
                                                <MdOutlineCurrencyExchange size={18} />
                                            </span>
                                            <span className="menu-link-text">Agents</span>
                                        </NavLink>
                                    </li>
                                    <li className={`menu-item ${activeMenu === 'customers' ? 'active' : ''}`}>
                                        <NavLink to={`/employee/customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('customers')}>
                                            <span className="menu-link-icon">
                                                <MdOutlineCurrencyExchange size={18} />
                                            </span>
                                            <span className="menu-link-text">customers</span>
                                        </NavLink>
                                    </li>
                                    <li className={`menu-item ${activeMenu === 'registered-customers' ? 'active' : ''}`}>
                                        <NavLink to={`/employee/registered-customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('registered-customers')}>
                                            <span className="menu-link-icon">
                                                <MdOutlineCurrencyExchange size={18} />
                                            </span>
                                            <span className="menu-link-text">Registered customers</span>
                                        </NavLink>
                                    </li>

                                </ul>
                            )}
                        </li>
                        <li className={`menu-item ${activeMenu === 'locations' ? 'active' : ''}`}>
                            <button className="menu-link" onClick={() => handleMenuClick('locations')} style={{ marginBottom: '6px' }}>
                                <span className="menu-link-icon">
                                    <MdOutlineCreate size={20} />
                                </span>
                                <span className="menu-link-text">Locations</span>
                            </button>
                            {(activeMenu === 'locations' || activeMenu === 'state' || activeMenu === 'city') && (
                                <ul className="menu-list" >
                                    <li className={`menu-item ${activeMenu === 'state' ? 'active' : ''}`}>
                                        <button className="menu-link" onClick={() => handleMenuClick('state')} style={{ marginBottom: '6px' }}>
                                            <span className="menu-link-icon">
                                                <MdOutlineCreate size={20} />
                                            </span>
                                            <span className="menu-link-text">State</span>
                                        </button>
                                        {(activeMenu === 'state' || activeMenu === 'add-state' || activeMenu === 'get-state') && (
                                            <ul className="menu-list" >
                                                <li className={`menu-item ${activeMenu === 'edit-state' ? 'active' : ''}`} style={{ marginBottom: '4px' }}>
                                                    <NavLink to={`/employee/edit-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('edit-state')}>
                                                        <span className="menu-link-icon">
                                                            <MdOutlinePersonAdd size={20} />
                                                        </span>
                                                        <span className="menu-link-text">Edit State</span>
                                                    </NavLink>
                                                </li>
                                                <li className={`menu-item ${activeMenu === 'get-state' ? 'active' : ''}`}>
                                                    <NavLink to={`/employee/get-state/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-state')}>
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
                                        <button className="menu-link" onClick={() => handleMenuClick('city')} style={{ marginBottom: '6px' }}>
                                            <span className="menu-link-icon">
                                                <MdOutlineCreate size={20} />
                                            </span>
                                            <span className="menu-link-text">City</span>
                                        </button>
                                        {(activeMenu === 'city' || activeMenu === 'edit-city' || activeMenu === 'get-city') && (
                                            <ul className="menu-list" >
                                                <li className={`menu-item ${activeMenu === 'add-city' ? 'active' : ''}`} style={{ marginBottom: '4px' }}>
                                                    <NavLink to={`/employee/edit-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('edit-city')}>
                                                        <span className="menu-link-icon">
                                                            <MdOutlinePersonAdd size={20} />
                                                        </span>
                                                        <span className="menu-link-text">Edit City</span>
                                                    </NavLink>
                                                </li>
                                                <li className={`menu-item ${activeMenu === 'get-city' ? 'active' : ''}`}>
                                                    <NavLink to={`/employee/get-city/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('get-city')}>
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
                        <li className={`menu-item ${activeMenu === 'all-documents' ? 'active' : ''}`}>
                            <NavLink to={`/employee/all-documents/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('all-documents')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">All Documents</span>
                            </NavLink>
                        </li>

                        <li className={`menu-item ${activeMenu === 'commissions' ? 'active' : ''}`}>
                            <NavLink to={`/employee/commissions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('commissions')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">commissions</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'transactions' ? 'active' : ''}`}>
                            <NavLink to={`/employee/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('transactions')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">Transactions</span>
                            </NavLink>
                        </li>


                    </ul>
                </div>


                <div className="sidebar-menu sidebar-menu2">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink to={`/employee/profile/${routeParams.id}`} className="menu-link" activeClassName="active">
                                <span className="menu-link-icon">
                                    <MdOutlineSettings size={20} />
                                </span>
                                <span className="menu-link-text">Profile</span>
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
