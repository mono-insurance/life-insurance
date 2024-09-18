import React, { useState } from 'react';
import axios from 'axios';
import { SendOtp, VerifyOpt, PasswordResetRequest } from '../../../services/AuthServices';
import { useNavigate } from 'react-router-dom';
function PasswordReset() {
    const navigate = useNavigate()
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showPasswordInputs, setShowPasswordInputs] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUsernameOrEmailChange = (event) => {
        setUsernameOrEmail(event.target.value);
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Send request to API to check if username or email exists
            const response = await SendOtp(usernameOrEmail)

            if (response.status === 200) {
                // Show OTP input field
                setShowOtpInput(true);
            } else {
                // Handle error if user doesn't exist
                setError('User not found.');
            }
        } catch (error) {
            console.error('Error checking user:', error);
            setError('An error occurred. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            // Send request to API to verify OTP
            const response = await VerifyOpt(otp, usernameOrEmail);
            if (response.status === 200 && response.data == true) {
                // Show password input fields
                setShowPasswordInputs(true);
            } else {
                // Handle error if OTP is invalid
                setError('Invalid OTP.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('An error occurred. Please try again.');
        }
    };

    const handleFinalSubmit = async () => {
        try {
            // Send request to API to update password
            const formData = {
                otp: otp,
                userNameOrEmail: usernameOrEmail,
                newPassword: newPassword,
            }
            console.log('formData in passwrod reset', formData)
            const response = await PasswordResetRequest(formData)

            if (response.status === 200) {
                // Password updated successfully
                setSuccessMessage('Password updated successfully!');
                // Clear form fields and hide password inputs
                setShowPasswordInputs(false);
                navigate('/login')

                setUsernameOrEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Handle error if password update fails
                setError('An error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4 items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-center mb-4">Password Reset</h1>
            <div className="mb-4">
                <label htmlFor="usernameOrEmail" className="block text-gray-700 font-bold mb-2">
                    Username or Email
                </label>
                <input
                    type="text"
                    id="usernameOrEmail"
                    value={usernameOrEmail}
                    onChange={handleUsernameOrEmailChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ width: "200px", margin: "0 auto" }}
                />
            </div>
            <div className="mb-4">
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
            </div>
            {showOtpInput && (
                <div className="mb-4">
                    <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">
                        OTP
                    </label>
                    <input
                        type="text"
                        id="otp"
                        value={otp}
                        onChange={handleOtpChange}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                        onClick={handleVerifyOtp}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Verify OTP
                    </button>
                </div>
            )}
            {showPasswordInputs && (
                <div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <button
                        onClick={handleFinalSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </div>
            )}
            {!showPasswordInputs && <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Submit
            </button>}
        </div>
    );
}

export default PasswordReset;