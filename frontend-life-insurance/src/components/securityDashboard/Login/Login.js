import React, { useContext, useState } from 'react'
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
    const {resetSidebar} = useContext(SidebarContext);


    const handleSubmit = async(e) =>{
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
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("id", response.data.id);

            resetSidebar();
            successToast("Login successful!");

            if(response.data.role === "Admin"){
                navigate(`/suraksha/admin/dashboard/${response.data.id}`)
            }

            if(response.data.role === "Customer"){
                const redirectPath = location.state?.from || `/suraksha/home`;
                navigate(redirectPath);
            }
            if(response.data.role === "Employee"){
                navigate(`/employee/dashboard/${response.data.id}`)
            }
            if(response.data.role === "Agent"){
                navigate(`/agent/dashboard/${response.data.id}`)
            }
        } 
        catch (error) {
            if (error.specificMessage === "Your account is inactive") {
                errorToast(error.specificMessage);
            } else {
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
                <p>Forget Password?<span onClick={()=> navigate('/suraksha/password-reset')}className='text-indigo-500 cursor-pointer underline'>Click here</span></p>
            </div>  
        </form>
        <ToastContainer position="bottom-right"/>
        
        </>  
    )
}
















{/* <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dialog-centered" className="custom-modal">
                <Modal.Header closeButton={false}>
                    <Modal.Title>Account Inactive</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formState.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCustomerId">
                            <Form.Label>Customer ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your Customer ID"
                                name="customerId"
                                value={formState.customerId}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="custom-modal-footer">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal> */}



    // const handleModalSubmit = async () => {
    //     try {
           
    //         const formErrors = validateRequestForm(formState);

    //         if (Object.keys(formErrors).length > 0) {
    //             Object.values(formErrors).forEach((errorMessage) => {
    //               errorToast(errorMessage);
    //             });
    //             return;
    //           }
              
    //         await customerRequestActivation(formState.email, formState.password, formState.customerId);
            
    //         successToast("Request submitted successfully!");
    //         setShowModal(false);
    //     } catch (error) {
    //         setShowModal(false);
    //         if (error.response?.data?.message || error.specificMessage) {
    //             errorToast(error.response?.data?.message || error.specificMessage);
    //         } else {
    //             errorToast("An unexpected error occurred. Please try again later.");
    //         }
    //     }
    // };



    // const handleChange = (event) => {
    //     setFormState({
    //       ...formState,
    //       [event.target.name]: event.target.value,
    //     });
    //   };