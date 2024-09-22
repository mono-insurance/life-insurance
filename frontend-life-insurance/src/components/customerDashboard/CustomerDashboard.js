import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { validateCustomer } from '../../services/AuthServices';
import './customerDashboard.scss';
import { errorToast } from '../../utils/helper/toast';
import { Navbar } from '../../sharedComponents/Navbar/Navbar';
import { Footer } from '../../sharedComponents/Footer/Footer';

export const CustomerDashboard = () => {
    const [isCustomer, setIsCustomer] = useState(false);
    const [customerId, setCustomerId] = useState();
    const navigate = useNavigate();


    const navLinks1 = [
        { label: 'HOME', path: '/suraksha/home' },
        { label: 'PRODUCTS', path: '/suraksha/insurances' },
        { label: 'QUERY', path: '/suraksha/customer/query' },
        { label: 'FEEDBACK', path: '/suraksha/customer/feedback' },
    ];

    const navLinks2 = [
      { label: 'HOME', path: '/suraksha/home' },
      { label: 'PRODUCTS', path: '/suraksha/insurances' }
  ];

    const dropdownItems = [
        { label: 'My Profile', onClick: () => navigate(`/suraksha/customer/profile`) },
        { label: 'Purchased Policies', onClick: () => navigate(`/suraksha/customer/policy-account`) },
        { label: 'Requests', onClick: () => navigate(`/suraksha/customer/requests`) },
        { label: 'Logout', onClick: () => {localStorage.removeItem('auth'); navigate('/suraksha/login'); }},
    ];
    useEffect(() => {
        const checkCustomer = async () => {
            try {
                console.log("Checking customer");   
                const customer = await validateCustomer();
                if (customer) {
                    setIsCustomer(true);
                    setCustomerId(customer.customerId);
                }
                console.log(customer);
            } catch (error) {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An error occurred while activating the account.");
                }
            }
        };
        checkCustomer();
    }, [navigate]);

    return (
        <>
            <div>
              {isCustomer &&(
                <>
                  <Navbar navLinks={navLinks1} dropdownItems={dropdownItems} />
                  <Outlet context={{ customerId }} />
                  <Footer/>
                </>
              )}
              {!isCustomer &&(
                <>
                  <Navbar navLinks={navLinks2} />
                  <Outlet context={0}/>
                  <Footer/>
                </>
              )}
            </div>
            <ToastContainer position="bottom-right" />
        </>
    );
};
