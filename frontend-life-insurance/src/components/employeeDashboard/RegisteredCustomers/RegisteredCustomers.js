import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './RegisteredCustomers.scss'
import { useParams } from 'react-router-dom';
import { allRegisteredCustomers, approveCustomerProfile } from '../../../services/EmployeeServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

export const RegisteredCustomers = () => {
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showActiveCustomers, setShowActiveCustomers] = useState(false);
    const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [customerId, setCustomerId] = useState('');
    const routeParams = useParams();


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            validateCustomerId(customerId);
            const isApproved = true;
            await approveCustomerProfile(customerId, isApproved);
            fetchRegisteredCustomers()
            successToast("Customer has been activated successfully!");
            setCustomerId('');
        }
        catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An error occurred while Activating customer.");
            }
        }
    }

    const fetchRegisteredCustomers = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await allRegisteredCustomers(formData);
            console.log("in active customer click", response?.data.content ?? [])
            setData(response?.data ?? []);
            console.log("data in response", data)

            setKeysToBeIncluded(["customerId", "firstName", "dateOfBirth", "nomineeName", "nomineeRelation"]);
            setShowActiveCustomers(true);
            setShowInactiveCustomers(false);
        }
        catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An error occurred while Activating customers.");
            }
        }
    }
    useEffect(() => {
        fetchRegisteredCustomers();
    }, [currentPage, itemsPerPage]);


    return (
        <div className='content-area'>
            <AreaTop pageTitle={"Approve Customers"} pagePath={"Activate-Customers"} pageLink={`/admin/dashboard/${routeParams.id}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
                        <h3 className="data-table-title">New Registered Customers</h3>
                    </div>
                    <div className='activate-form'>
                        <form>
                            <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                            <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>Approve Customer</button>
                        </form>
                    </div>


                    {newlyActivated && (
                        <div className="deactivate-success">
                            {activatedData}
                        </div>
                    )}

                </div>
            </section>

            {(showActiveCustomers || showInactiveCustomers) && (
                <section className="content-area-table">
                    <div className="data-table-info">
                        <h3 className="data-table-title">Registered Customers</h3>
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={false}
                            handleButtonClick={null}
                        />
                    </div>
                </section>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    )
}
