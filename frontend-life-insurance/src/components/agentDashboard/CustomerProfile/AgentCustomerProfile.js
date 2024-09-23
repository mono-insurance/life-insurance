import React, { useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { fetchCustomer } from '../../../services/AgentService';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import './settings.scss';
import { useParams } from 'react-router-dom';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const AgentCustomerProfile = () => {
    const routeParams = useParams();
    const [loading, setLoading] = useState(true)


    // State for storing customer info
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nomineeName: '',
        nomineeRelation: '',
        address: {
            firstStreet: '',
            lastStreet: '',
            pincode: '',
            state: '',
            city: '',
        },
        credentials: {
            username: '',
            email: '',
            mobileNumber: '',
        },
    });

    // Fetch customer data from backend
    useEffect(() => {
        const fetchCustomerData = async () => {
            console.log("customer profile is ")
            try {
                console.log("customer profile is ", routeParams.customerId)
                const customerId = routeParams.customerId
                const customerData = await fetchCustomer(customerId);
                if (customerData) {
                    setCustomerInfo(customerData);
                }
            } catch (error) {
                if (error.response?.data?.message || error.specificMessage) {
                    errorToast(error.response?.data?.message || error.specificMessage);
                } else {
                    errorToast('An unexpected error occurred while fetching customer data. Please try again later.');
                }
            }
            setLoading(false)
        };

        fetchCustomerData();
    }, []);

    return (
        <div className="content-area">
            {loading && <Loader />}
            <AreaTop pageTitle={"Settings"} pagePath={"Settings"} pageLink={`/customer/policy-account/${routeParams.id}`} />

            {/* Personal Info Section */}
            <section className="content-area-form">
                <form className="admin-form">
                    <h3 className="data-table-title">Customer Personal Info</h3>
                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>First Name:</span>
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                value={customerInfo.firstName}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>Last Name:</span>
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                value={customerInfo.lastName}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>Date of Birth:</span>
                            </div>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={customerInfo.dateOfBirth}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>Gender:</span>
                            </div>
                            <input
                                type="text"
                                name="gender"
                                value={customerInfo.gender}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>Nominee Name:</span>
                            </div>
                            <input
                                type="text"
                                name="nomineeName"
                                value={customerInfo.nomineeName}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>Nominee Relation:</span>
                            </div>
                            <input
                                type="text"
                                name="nomineeRelation"
                                value={customerInfo.nomineeRelation}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>Email:</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={customerInfo.credentials.email}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>Mobile Number:</span>
                            </div>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={customerInfo.credentials.mobileNumber}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>
                </form>
            </section>

            {/* Address Info Section */}
            <section className="content-area-form">
                <form className="admin-form">
                    <h3 className="data-table-title">Address Information</h3>
                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>First Street:</span>
                            </div>
                            <input
                                type="text"
                                name="firstStreet"
                                value={customerInfo.address.firstStreet}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>Second Street:</span>
                            </div>
                            <input
                                type="text"
                                name="lastStreet"
                                value={customerInfo.address.lastStreet}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="form-label">
                            <div className="label-container">
                                <span>Pincode:</span>
                            </div>
                            <input
                                type="text"
                                name="pincode"
                                value={customerInfo.address.pincode}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>State:</span>
                            </div>
                            <input
                                type="text"
                                name="state"
                                value={customerInfo.address.state}
                                className="form-input"
                                disabled
                            />
                        </label>

                        <label className="form-label">
                            <div className="label-container">
                                <span>City:</span>
                            </div>
                            <input
                                type="text"
                                name="city"
                                value={customerInfo.address.city}
                                className="form-input"
                                disabled
                            />
                        </label>
                    </div>
                </form>
            </section>

            {/* Toast */}
            <ToastContainer />
        </div>
    );
};
