import React, { useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../../context/ThemeContext';
import { SidebarContext } from '../../../context/SidebarContext';
import { NavLink, useParams } from 'react-router-dom';
import {
<<<<<<< HEAD
    MdOutlineClose,
    MdOutlineLogout,
    MdOutlineSettings,
    MdOutlinePolicy,
    MdOutlineBook,
    MdOutlineQueryBuilder,
    MdOutlineQuestionAnswer,
    MdOutlineFeedback,
    MdOutlineQuestionMark,
    MdOutlineRequestPage
  } from "react-icons/md";
=======
  MdOutlineClose,
  MdOutlineCurrencyExchange,
  MdOutlineLogout,
  MdOutlineSettings,
  MdOutlineBook,
  MdOutlineAccountBalance
} from "react-icons/md";
>>>>>>> main
import LogoBlue from "../../../assets/images/logo_blue.svg";
import LogoWhite from "../../../assets/images/logo_white.svg";
import { fetchCustomer } from '../../../services/CustomerServices';
import './sidebar.scss';
import { errorToast } from '../../../utils/helper/toast';
import { fetchListOfActiveInsuranceCategories } from '../../../services/AdminServices';

export const Sidebar = () => {
<<<<<<< HEAD
    const { theme } = useContext(ThemeContext);
    const { isSidebarOpen, closeSidebar, handleMenuClick, activeMenu, resetSidebar} = useContext(SidebarContext);
    const navbarRef = useRef(null);
    const [name, setName] = useState('');
    const [insuranceTypes, setInsuranceTypes] = useState([]);
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
      const fetchCustomerData = async () => {
        try{
          const customerData = await fetchCustomer(routeParams.id);
          if (customerData) {
            setName(customerData.firstName+" "+customerData.lastName);
          }
        }catch(error){
          console.log(error)
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred while fetching admin data. Please try again later.");
          }
        }
      };
    
      fetchCustomerData();
=======
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

>>>>>>> main
  }, []);


    useEffect(() => {
      const fetchData = async () => {
          try {
              const insuranceTypesData = await fetchListOfActiveInsuranceCategories();
              setInsuranceTypes(insuranceTypesData);
          } catch (error) {
              errorToast('Error fetching data');
          }
      };
      fetchData();
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
            <li className={`menu-item ${activeMenu === 'insurance' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('insurance')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlinePolicy size={20} />
                </span>
                <span className="menu-link-text">Get Insurance</span>
              </button>
              {(activeMenu.startsWith('insurance')) && (
                <ul className="menu-list" >
                  {insuranceTypes.map((insuranceType) => (
                    <li key={insuranceType.typeId} className={`menu-item ${activeMenu === 'insurance' + insuranceType.typeId ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                      <NavLink to={`/customer/insurance/${routeParams.id}/type/${insuranceType.typeId}`} className="menu-link" activeClassName="active" onClick={() => handleMenuClick('insurance' + insuranceType.typeId)}>
                        <span className="menu-link-text">{insuranceType.insuranceCategory}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
           </li>
            <li className={`menu-item ${activeMenu === 'policy-account' ? 'active' : ''}`}>
              <NavLink to={`/customer/policy-account/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('policy-account')}>
                <span className="menu-link-icon">
                  <MdOutlineBook size={18} />
                </span>
                <span className="menu-link-text">Policy Accounts</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'requests' ? 'active' : ''}`}>
              <NavLink to={`/customer/requests/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('requests')}>
                <span className="menu-link-icon">
                  <MdOutlineRequestPage size={18} />
                </span>
                <span className="menu-link-text">Requests</span>
              </NavLink>
            </li>
            <li className={`menu-item ${activeMenu === 'query' ? 'active' : ''}`}>
              <button className="menu-link" onClick={() => handleMenuClick('query')} style={{marginBottom: '6px'}}>
                <span className="menu-link-icon">
                  <MdOutlineQuestionMark size={20} />
                </span>
                <span className="menu-link-text">Queries</span>
              </button>
              {(activeMenu === 'query' || activeMenu === 'add-query' || activeMenu === 'get-query') && (
                <ul className="menu-list" >
                  <li className={`menu-item ${activeMenu === 'add-query' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/customer/add-query/${routeParams.id}`} className="menu-link" activeClassName="active" onClick={() => handleMenuClick('add-query')}>
                    <span className="menu-link-icon">
                      <MdOutlineQueryBuilder size={18} />
                    </span>
                      <span className="menu-link-text">Add Query</span>
                    </NavLink>
                  </li>
                  <li className={`menu-item ${activeMenu === 'get-query' ? 'active' : ''}`} style={{marginBottom: '4px'}}>
                    <NavLink to={`/customer/query/${routeParams.id}`} className="menu-link" activeClassName="active" onClick={() => handleMenuClick('get-query')}>
                    <span className="menu-link-icon">
                      <MdOutlineQuestionAnswer size={18} />
                    </span>
                      <span className="menu-link-text">View FAQs</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li className={`menu-item ${activeMenu === 'feedback' ? 'active' : ''}`}>
              <NavLink to={`/customer/feedback/${routeParams.id}`} className="menu-link" onClick={() => handleMenuClick('feedback')}>
                <span className="menu-link-icon">
                  <MdOutlineFeedback size={18} />
                </span>
                <span className="menu-link-text">Feedback</span>
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
              <NavLink to={`/customer/settings/${routeParams.id}`} className="menu-link" activeClassName="active">
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
