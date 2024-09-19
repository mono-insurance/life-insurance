import React, { useContext, useState } from 'react'
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
    const { resetSidebar } = useContext(SidebarContext);
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

    const handleSubmit = async (e) => {
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
            localStorage.setItem("role", response.data.role)
            localStorage.setItem("id", response.data.id)

            resetSidebar();
            successToast("Login successful!");

            if (response.data.role === "Admin") {
                navigate(`/admin/dashboard/${response.data.id}`)
            }
            if (response.data.role === "Agent") {
                navigate(`/agent/dashboard/${response.data.id}`)
            }
            if (response.data.role === "Employee") {
                navigate(`/employee/dashboard/${response.data.id}`)
            }
            if (response.data.role === "Customer") {
                navigate(`/`)
            }
        }
        catch (error) {
            if (error.specificMessage === "Your account is inactive. Please contact Admin to make it active.") {
                errorToast(error.specificMessage);
                setModalMessage("Your Account is inactive. Please fill the form below to make the request to activate your account.");
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
            <form className="flex flex-col items-center justify-center h-screen">
                <div className="bg-white shadow-md rounded-lg p-8 w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    <label className="block text-gray-700 font-bold mb-2"><b>Email</b></label>
                    <input
                        type="text"
                        placeholder="Enter Email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block text-gray-700 font-bold mb-2"><b>Password</b></label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>

                    <div className="text-center mt-4">
                        <span>Don't have an account? </span>
                        <a
                            href="/register"
                            className="text-blue-500 hover:underline"
                        >
                            Register here
                        </a>
                    </div>
                    <div className="text-center mt-4">
                        <span>forgot password?</span>
                        <a
                            href="/change-password"
                            className="text-blue-500 hover:underline"
                        >
                            Click me
                        </a>
                    </div>
                </div>
            </form>

            <ToastContainer position="bottom-right" />

            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-dialog-centered">
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleModalSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
