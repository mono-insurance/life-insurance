import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SendOtp, VerifyOpt, PasswordResetRequest } from '../../../services/AuthServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import {
    MdOutlineArrowLeft,
} from "react-icons/md";
import { validatePassword, validateUsernameOrEmail } from '../../../utils/validations/Validations';

const PasswordReset = () => {
    const navigate = useNavigate();
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [showPasswordInputs, setShowPasswordInputs] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUsernameOrEmailChange = (event) => setUsernameOrEmail(event.target.value);
    const handleOtpChange = (event) => setOtp(event.target.value);
    const handleNewPasswordChange = (event) => setNewPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            validateUsernameOrEmail(usernameOrEmail);
            const response = await SendOtp(usernameOrEmail);

            if (response.status === 200) {
                setShowOtpInput(true);
                successToast('OTP has been sent to your registered email.');
            } else {
                setError('User not found.');
                errorToast('User not found.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            errorToast('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            
            const response = await VerifyOpt(otp, usernameOrEmail);

            if (response.status === 200 && response.data === true) {
                setShowPasswordInputs(true);
                successToast('OTP verified successfully.');
            } else {
                setError('Invalid OTP.');
                errorToast('Invalid OTP.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            errorToast('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalSubmit = async () => {

        try {
            setLoading(true);
            validatePassword(newPassword, confirmPassword);
            const formData = { otp, userNameOrEmail: usernameOrEmail, newPassword };
            const response = await PasswordResetRequest(formData);

            if (response.status === 200) {
                successToast('Password updated successfully!');
                navigate('/suraksha/login');
            } else {
                setError('An error occurred. Please try again.');
                errorToast('An error occurred. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            errorToast('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
    {loading && <Loader />}
    <div className="flex flex-col gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <div className='flex items-center'>
            <div 
                onClick={() => navigate('/suraksha/login')} 
                className="top-4 left-4 cursor-pointer text-black-500 hover:text-gray-700"
            >
                <MdOutlineArrowLeft size={40} /> 
            </div>
            <h1 className="text-2xl font-semibold ml-2">Password Reset</h1>
        </div>
        <div className="w-full">
            <label className="text-lg">Username or Email</label>
            <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                placeholder="Enter Username or Email"
                value={usernameOrEmail}
                onChange={handleUsernameOrEmailChange}
                required 
                disabled={showOtpInput || showPasswordInputs}
            />
        </div>

        {showOtpInput && (
            <div className="w-full">
                <label className="text-lg">OTP</label>
                <input
                    className="border border-zinc-300 rounded w-full p-2 mt-1"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    required
                    disabled={showPasswordInputs}
                />
                {!showPasswordInputs && (
                    <button
                    className="bg-indigo-500 text-white py-2 rounded-md text-base mt-2 w-full"
                    onClick={handleVerifyOtp}
                    
                >
                    Verify OTP
                </button>)
                    }
                
            </div>
        )}

        {showPasswordInputs && (
            <>
                <div className="w-full">
                    <label className="text-lg">New Password</label>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                    />
                </div>

                <div className="w-full">
                    <label className="text-lg">Confirm Password</label>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                </div>

                <button
                    className="bg-indigo-500 text-white py-2 rounded-md text-base mt-2 w-full"
                    onClick={handleFinalSubmit}
                >
                    Update Password
                </button>
            </>
        )}

        {!showPasswordInputs && !showOtpInput && (
            <button
                className="bg-indigo-500 text-white py-2 rounded-md text-base mt-2 w-full"
                onClick={handleSubmit}
            >
                Submit
            </button>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
    <ToastContainer position="bottom-right" />
</div>

    );
};

export default PasswordReset;
