import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { verifyCustomer } from '../../services/AuthServices';
import './customerDashboard.scss';
import { Sidebar } from './Sidebar/Sidebar';
import { errorToast } from '../../utils/helper/toast';

export const CustomerDashboard = () => {
  const [isCustomer, setIsCustomer] = useState(false);
  const navigate = useNavigate();
  const routeParams = useParams();

  useEffect(() => {
    const checkCustomer = async () => {
      try {
        const customerStatus = await verifyCustomer({ customerId: routeParams.id });
        setIsCustomer(customerStatus);
        if (!customerStatus) {
          navigate('/login');
        }
      } catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while Activating account.");
        }
      }
    };
    checkCustomer();
  }, [navigate]);

  return (
    <>
      {isCustomer && (
        <main className="page-wrapper">
          <Sidebar />
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>)
      }
      <ToastContainer position="bottom-right" />
    </>
  )
}
