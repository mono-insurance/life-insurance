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
import { fetchAgent } from "../../../services/AgentService";

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
        const fetchAgentData = async () => {
            try {
                const agentData = await fetchAgent();
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

        fetchAgentData();
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
                            <NavLink to={`/agent/dashboard/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('dashboard')}>
                                <span className="menu-link-icon">
                                    <MdOutlineGridView size={18} />
                                </span>
                                <span className="menu-link-text">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'customers' ? 'active' : ''}`}>
                            <NavLink to={`/agent/customers/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('customers')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">customers</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'commissions' ? 'active' : ''}`}>
                            <NavLink to={`/agent/commissions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('commissions')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">commissions</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'transactions' ? 'active' : ''}`}>
                            <NavLink to={`/agent/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('transactions')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">Transactions</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'email' ? 'active' : ''}`}>
                            <NavLink to={`/agent/email/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('email')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">Send Emails</span>
                            </NavLink>
                        </li>
                        <li className={`menu-item ${activeMenu === 'balance' ? 'active' : ''}`}>
                            <NavLink to={`/agent/balance/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('balance')}>
                                <span className="menu-link-icon">
                                    <MdOutlineCurrencyExchange size={18} />
                                </span>
                                <span className="menu-link-text">My Balance</span>
                            </NavLink>
                        </li>


                    </ul>
                </div>


                <div className="sidebar-menu sidebar-menu2">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink to={`/agent/profile/${routeParams.id}`} className="menu-link" activeClassName="active">
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