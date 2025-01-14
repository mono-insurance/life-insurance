import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Sidebar } from './Sidebar/Sidebar';
import { verifyEmployee } from '../../services/AuthServices';
import './Employee.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../utils/helper/toast';

export const Employee = () => {
    const [isAgent, setIsAgent] = useState(false);
    const navigate = useNavigate();
    const routeParams = useParams();

    useEffect(() => {
        const checkAgent = async () => {
            try {
                const agentStatus = await verifyEmployee({ empId: routeParams.id });
                setIsAgent(agentStatus);
                if (!agentStatus) {
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
        checkAgent();
    }, [routeParams.id, navigate]);

    return (
        <>
            {isAgent && (
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
