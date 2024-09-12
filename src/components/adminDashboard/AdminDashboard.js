import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from './Sidebar/Sidebar';
import { verifyAdmin } from '../../services/AuthServices';
import './adminDashboard.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../utils/helper/toast';

export const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const routeParams = useParams();

  useEffect(() => {
    const checkAdmin = async () => {
      try{
          const adminStatus = await verifyAdmin({adminId : routeParams.id});
          setIsAdmin(adminStatus);
          if (!adminStatus) {
            navigate('/auth/login');
          }
        }catch(error){
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
            errorToast("An error occurred while Activating account.");
          }
        }
    };
    checkAdmin();
  }, [routeParams.id, navigate]);

  return (
    <>
    {isAdmin && (
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
