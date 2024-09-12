import React, { useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import './settings.scss'; // You can use your own SCSS file here
import { fetchAdmin, updateAdminProfile } from '../../../services/AdminServices'; // Fetch existing admin details and update profile service
import { useParams } from 'react-router-dom';
import { validateForm } from '../../../utils/validations/Validations';

export const Settings = () => {
    const { id } = useParams(); // Admin ID from the route

    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: 'ADMIN', // Role stays ADMIN
    });

    const handleChange = (event) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formErrors = validateForm(formState);
            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach((errorMessage) => errorToast(errorMessage));
                return;
            }

            await updateAdminProfile(formState); // Updating admin profile
            successToast('Admin profile updated successfully!');
        } catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast('An unexpected error occurred. Please try again later.');
            }
        }
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminData = await fetchAdmin(id); // Fetch admin data by ID
                setFormState({ ...adminData, password: '' }); // Pre-fill form without password
            } catch (error) {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast('Error fetching admin data.');
                }
            }
        };
        fetchAdminData();
    }, [id]);

    return (
        <div className="content-area">
            <AreaTop pageTitle={"Settings"} pagePath={"Settings"} pageLink={`/admin/dashboard/${id}`} />
            <section className="content-area-form">
                <form className="admin-form" onSubmit={handleSubmit}>
                    <h3 className="data-table-title">Update Profile</h3>
                    <div className="form-row">
                    <label className="form-label">
                    <div className="label-container">
                        <span>First Name:</span>
                        <span className="text-danger"> *</span>
                    </div>
                    <input type="text" name="firstName" value={formState.firstName} onChange={handleChange} className="form-input" placeholder='Enter First Name' required/>
                    </label>
                    <label className="form-label">
                        Last Name:
                        <input type="text" name="lastName" value={formState.lastName} onChange={handleChange} className="form-input" placeholder='Enter Last Name'/>
                    </label>
                    </div>

                    <label className="form-label">
                        Username:<span className="text-danger"> *</span>
                        <input
                            type="text"
                            name="username"
                            value={formState.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Username"
                            required
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
                        Password:<span className="text-danger"> *</span>
                        <input
                            type="password"
                            name="password"
                            value={formState.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter Password"
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
                </form>
            </section>
            <ToastContainer position="bottom-right" />
        </div>
    );
};
