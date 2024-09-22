import React, { useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom';

import './login.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { SidebarContext } from '../../../context/SidebarContext';
import { login } from '../../../services/AuthServices';
import { validateLoginForm } from '../../../utils/validations/Validations';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
//<<<<<<< HEAD
//    const { resetSidebar } = useContext(SidebarContext);
//    const [showModal, setShowModal] = useState(false);
//    const [modalMessage, setModalMessage] = useState('');
//    const [formState, setFormState] = useState({
//        email: '',
//        password: '',
//        customerId: '',
//    });
//
//    const handleChange = (event) => {
//        setFormState({
//            ...formState,
//            [event.target.name]: event.target.value,
//        });
//    };
//
//    const handleSubmit = async (e) => {
//=======
    const {resetSidebar} = useContext(SidebarContext);


    const handleSubmit = async(e) =>{
//>>>>>>> 660a0b3446f2ae63bc3cc6ff40f6c9a48ffecf0c
        e.preventDefault();

        try {
            setLoading(true);
            const formErrors = validateLoginForm(email, password);

            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach((errorMessage) => {
                    errorToast(errorMessage);
                });
                return;
            }

            const response = await login(email, password);
            const token = response.headers['authorization'];
            localStorage.setItem("auth", token);
            localStorage.setItem("role", response.data.role)
            localStorage.setItem("id", response.data.id)

            resetSidebar();
            successToast("Login successful!");

            if (response.data.role === "Admin") {
                navigate(`/admin/dashboard/${response.data.id}`)
            }
            if (response.data.role === "Agent") {
                navigate(`/agent/dashboard/${response.data.id}`)


            if(response.data.role === "Customer"){
                const redirectPath = location.state?.from || `/suraksha/home`;
                navigate(redirectPath);
            }
            if (response.data.role === "Employee") {
                navigate(`/employee/dashboard/${response.data.id}`)
            }
            if (response.data.role === "Customer") {
                navigate(`/`)
            }
        }
        catch (error) {
            if (error.specificMessage === "Your account is inactive") {
                errorToast(error.specificMessage);
            }
            else {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An unexpected error occurred. Please try again later.");
                }
            }
        } finally{
            setLoading(false);
        }
    }

//<<<<<<< HEAD
//    const handleModalSubmit = async () => {
//        try {
//            const formErrors = validateRequestForm(formState);
//            if (Object.keys(formErrors).length > 0) {
//                Object.values(formErrors).forEach((errorMessage) => {
//                    errorToast(errorMessage);
//                });
//                return;
//            }
//
//            await customerRequestActivation(formState.email, formState.password, formState.customerId);
//            successToast("Request submitted successfully!");
//            setShowModal(false);
//        } catch (error) {
//            setShowModal(false);
//            if (error.response?.data?.message || error.specificMessage) {
//                errorToast(error.response?.data?.message || error.specificMessage);
//            } else {
//                errorToast("An unexpected error occurred. Please try again later.");
//            }
//        }
//    };

//    return (
//        <>
//            <form className="flex flex-col items-center justify-center h-screen">
//                <div className="bg-white shadow-md rounded-lg p-8 w-96">
//                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//
//                    <label className="block text-gray-700 font-bold mb-2"><b>Email</b></label>
//                    <input
//                        type="text"
//                        placeholder="Enter Email"
//                        name="email"
//                        className="w-full p-2 border border-gray-300 rounded mb-4"
//                        onChange={(e) => setEmail(e.target.value)}
//                        required
//                    />
//
//                    <label className="block text-gray-700 font-bold mb-2"><b>Password</b></label>
//                    <input
//                        type="password"
//                        placeholder="Enter Password"
//                        name="password"
//                        className="w-full p-2 border border-gray-300 rounded mb-4"
//                        onChange={(e) => setPassword(e.target.value)}
//                        required
//                    />
//
//                    <button
//                        type="submit"
//                        className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
//                        onClick={handleSubmit}
//                    >
//                        Login
//                    </button>
//
//                    <div className="text-center mt-4">
//                        <span>Don't have an account? </span>
//                        <a
//                            href="/register"
//                            className="text-blue-500 hover:underline"
//                        >
//                            Register here
//                        </a>
//                    </div>
//                    <div className="text-center mt-4">
//                        <span>forgot password?</span>
//                        <a
//                            href="/change-password"
//                            className="text-blue-500 hover:underline"
//                        >
//                            Click me
//                        </a>
//                    </div>
//                </div>
//            </form>
//
//            <ToastContainer position="bottom-right" />
//
//            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dialog-centered">
//=======

    return (
        <>
        <form className='min-h-[80vh] flex items-center'>
            {loading && <Loader />}
            <div className='flex flex-col gap-3 m-auto item-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>Login</p>

                <div className='w-full'>
                    <p className='text-lg'>Email</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='w-full'>
                    <p className='text-lg'>Password</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" placeholder="Enter Password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base' type="submit" onClick={handleSubmit}>Login</button>
                <p>Register account?<span onClick={()=> navigate('/suraksha/register')}className='text-indigo-500 cursor-pointer underline'>Click here</span></p>
            </div>  
        </form>
        <ToastContainer position="bottom-right"/>
        
        </>  
    )
}