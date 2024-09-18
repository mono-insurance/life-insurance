import React, { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../../context/ThemeContext';
import { SidebarContext } from '../../../context/SidebarContext';
import { NavLink, useParams } from 'react-router-dom';
import {
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineLogout,
  MdOutlineSettings,
  MdOutlineBook,
  MdOutlineAccountBalance
} from "react-icons/md";
import LogoBlue from "../../../assets/images/logo_blue.svg";
import LogoWhite from "../../../assets/images/logo_white.svg";
import { fetchCustomer } from '../../../services/CustomerServices';
import './sidebar.scss';
import { errorToast } from '../../../utils/helper/toast';

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
    const fetchAdminData = async () => {
      try {
        const adminData = await fetchCustomer();
        if (adminData) {
          setName(adminData.firstName + " " + adminData.lastName);
        }
      } catch (error) {
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
          <span className="sidebar-brand-text">{name}</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className={`menu-item ${activeMenu === 'makeTransactions' ? 'active' : ''}`}>
              <NavLink to={`/user/transactions/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('makeTransactions')}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Make Transactions</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'passbook' ? 'active' : ''}`}>
              <NavLink to={`/user/passbook/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('passbook')}>
                <span className="menu-link-icon">
                  <MdOutlineBook size={20} />
                </span>
                <span className="menu-link-text">Passbook</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'accounts' ? 'active' : ''}`}>
              <NavLink to={`/user/accounts/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('accounts')}>
                <span className="menu-link-icon">
                  <MdOutlineAccountBalance size={18} />
                </span>
                <span className="menu-link-text">Accounts</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'documents' ? 'active' : ''}`}>
              <NavLink to={`/user/documents/upload`} className="menu-link" onClick={() => handleMenuClick('documents')}>
                <span className="menu-link-icon">
                  <MdOutlineCurrencyExchange size={18} />
                </span>
                <span className="menu-link-text">Upload Document</span>
              </NavLink>
            </li>
          </ul>
        </div>


        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to={`/user/settings/${routeParams.id}`} className="menu-link" activeClassName="active">
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
  )
}
