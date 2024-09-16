import React, { useContext, useState } from 'react'
import './login.css';
import { useNavigate } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { SidebarContext } from '../../../context/SidebarContext';
import { Button, Form, Modal } from 'react-bootstrap';
import { customerRequestActivation, login } from '../../../services/AuthServices';
import { validateLoginForm, validateRequestForm } from '../../../utils/validations/Validations';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {resetSidebar} = useContext(SidebarContext);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formState, setFormState] = useState({
        email: '',
        password: '',
        customerId: '', 
      });


      const handleChange = (event) => {
        setFormState({
          ...formState,
          [event.target.name]: event.target.value,
        });
      };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try {
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

            resetSidebar();
            successToast("Login successful!");

            if(response.data.role === "Admin"){
                navigate(`/admin/dashboard/${response.data.id}`)
            }

            if(response.data.role === "Customer"){
                navigate(`/customer/policy-account/${response.data.id}`)
            }
        } 
        catch (error) {
            if (error.specificMessage === "Your account is inactive. Please contact Admin to make it active.") {
                errorToast(error.specificMessage);
                setModalMessage("Your Account is inactive. Please fill the form below to make the request to activate your account.");
                setShowModal(true);
            } else {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast("An unexpected error occurred. Please try again later.");
                }
            }
        }
        
    }


    const handleModalSubmit = async () => {
        try {
           
            const formErrors = validateRequestForm(formState);

            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach((errorMessage) => {
                  errorToast(errorMessage);
                });
                return;
              }
              
            await customerRequestActivation(formState.email, formState.password, formState.customerId);
            
            successToast("Request submitted successfully!");
            setShowModal(false);
        } catch (error) {
            setShowModal(false);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    };




    return (
        <>
        <form>
            <div className="login-container">

                <label><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} required />

                <label><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="password" onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className="registerbtn" onClick={handleSubmit}>Login</button>
            </div>  
        </form>
        <ToastContainer position="bottom-right"/>
        <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dialog-centered" className="custom-modal">
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
            </Modal>
        </>  
    )
}
