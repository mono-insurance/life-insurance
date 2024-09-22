import React, { useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import './settings.scss'; // You can use your own SCSS file here
import { fetchAdmin, updateAdminProfile, updateAdminPassword } from '../../../services/AdminServices'; // Added update password service
import { useParams } from 'react-router-dom';
import { validateAdminProfileForm, validateForm, validatePasswordInfoForm } from '../../../utils/validations/Validations';
import { profilePasswordUpdate } from '../../../services/AuthServices';

export const Settings = () => {
    const { id } = useParams(); // Admin ID from the route

    // State for profile update
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        mobileNumber: '',
        role: 'ADMIN', // Role stays ADMIN
    });

    // State for password update
    const [passwordState, setPasswordState] = useState({
        oldPassword: '',
        newPassword: '',
        retypeNewPassword: ''
    });

    // Handle form changes for both profile and password
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        if (name in formState) {
            setFormState({
                ...formState,
                [name]: value,
            });
        } else if (name in passwordState) {
            setPasswordState({
                ...passwordState,
                [name]: value,
            });
        }
    };

    // Handle profile update submission
    const handleSubmitProfile = async (event) => {
        event.preventDefault();
        try {
            const formErrors = validateAdminProfileForm(formState);
            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach((errorMessage) => errorToast(errorMessage));
                return;
            }

            await updateAdminProfile(formState); // Updating admin profile
            successToast('Admin profile updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
            errorToast(errorMessage);
        }
    };

    // Handle password update submission
    const handleSubmitPassword = async (event) => {
        event.preventDefault();

        try {
            validatePasswordInfoForm(passwordState); // Validate password form
            await profilePasswordUpdate(passwordState); // Call password update service
            successToast('Password updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
            errorToast(errorMessage);
        }
    };

    // Fetch admin data when component mounts
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminData = await fetchAdmin(id); // Fetch admin data by ID
                setFormState({ ...adminData, role: 'ADMIN'}); // Pre-fill form without password
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.specificMessage || 'Error fetching admin data.';
                errorToast(errorMessage);
            }
        };
        fetchAdminData();
    }, [id]);

    return (
        <div className="content-area">
            <AreaTop pageTitle={"Settings"} pagePath={"Settings"} pageLink={`/admin/dashboard/${id}`} />

            <section className="content-area-form">
                {/* Profile Update Form */}
                <form className="admin-form" onSubmit={handleSubmitProfile}>
                    <h3 className="data-table-title">Update Profile</h3>
                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>First Name:</span>
                                <span className="text-danger"> *</span>
                            </div>
                            <input type="text" name="firstName" value={formState.firstName} onChange={handleChange} className="form-input" placeholder='Enter First Name' required />
                        </label>
                        <label className="form-label">
                            Last Name:
                            <input type="text" name="lastName" value={formState.lastName} onChange={handleChange} className="form-input" placeholder='Enter Last Name' />
                        </label>
                    </div>

                    <label className="form-label">
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formState.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Username"
                            readOnly
                            disabled
                        />
                    </label>

                    <label className="form-label">
                        Email:<span className="text-danger"> *</span>
                        <input
                            type="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Email"
                            required
                        />
                    </label>

                    <label className="form-label">
                        Mobile Number:<span className="text-danger"> *</span>
                        <input
                            type="tel"
                            name="mobileNumber"
                            value={formState.mobileNumber}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Mobile Number"
                            required
                        />
                    </label>

                    <button type="submit" className="form-submit">Update Profile</button>
                </form></section>
                <section className="content-area-form">
                {/* Password Update Form */}
                <form className="admin-form" onSubmit={handleSubmitPassword}>
                    <h3 className="data-table-title">Update Password</h3>
                    <label className="form-label">
                        Old Password:<span className="text-danger"> *</span>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordState.oldPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Old Password"
                            required
                        />
                    </label>

                    <label className="form-label">
                        New Password:<span className="text-danger"> *</span>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordState.newPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter New Password"
                            required
                        />
                    </label>

                    <label className="form-label">
                        Retype New Password:<span className="text-danger"> *</span>
                        <input
                            type="password"
                            name="retypeNewPassword"
                            value={passwordState.retypeNewPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Retype New Password"
                            required
                        />
                    </label>

                    <button type="submit" className="form-submit">Update Password</button>
                </form>
            </section>

            <ToastContainer position="bottom-right" />
        </div>
    );
};
