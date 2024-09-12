import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AllCustomers.scss'
import { useParams } from 'react-router-dom';
import { activateCustomer, activateParticularCustomer, deleteCustomer, getAllActiveCustomers, getAllInactiveCustomers, makeAllRequestsCustomerActivate } from '../../../services/EmployeeServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AllCustomers = () => {
    const navigate = useNavigate()
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showActiveCustomers, setShowActiveCustomers] = useState(true);
    const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [customerId, setCustomerId] = useState('');
    const routeParams = useParams();


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("current action ", showActiveCustomers)
        try {
            validateCustomerId(customerId);
            {
                !showActiveCustomers &&
                    await activateParticularCustomer(customerId);

                successToast("Customer has been activated successfully!");
                setCustomerId('');
            }
            {
                showActiveCustomers &&
                    await deleteCustomer(customerId);

                successToast("Customer has been deleted successfully!");
                setCustomerId('');
            }


        }
        catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An error occurred while Activating customer.");
            }
        }
    }
    const handleCustomerClicked = (customer) => {
        navigate(`/customer/${customer.customerId}`)
    }

    const handleActivateCustomers = async (e) => {
        e.preventDefault();
        try {

            const response = await makeAllRequestsCustomerActivate();

            console.log(response);
            setData(response?.data ?? []);
            setNewlyActivated(true);

        }
        catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An error occurred while Activating customers.");
            }
        }
    };


    const fetchActiveCustomers = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllActiveCustomers(formData);
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

    const fetchInactiveCustomers = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllInactiveCustomers(formData);
            console.log("fetchInactiveCustomers ", response)
            setData(response?.data ?? []);
            console.log("fetchInactiveCustomers is in data", data)

            setKeysToBeIncluded(["customerId", "firstName", "dateOfBirth", "nomineeName", "nomineeRelation", "Edit"]);
            setShowInactiveCustomers(true);
            setShowActiveCustomers(false);
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
        if (showActiveCustomers) {
            fetchActiveCustomers();
        }
        if (showInactiveCustomers) {
            fetchInactiveCustomers();
        }
        console.log("data in checking is", data)
    }, [currentPage, itemsPerPage]);


    useEffect(() => {
        resetPagination();
    }, []);

    useEffect(() => {
        resetPagination();
    }, [showActiveCustomers, showInactiveCustomers]);

    return (
        <div className='content-area'>
            <AreaTop pageTitle={"Activate Customers"} pagePath={"Activate-Customers"} pageLink={`/employee/dashboard/${routeParams.id}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
                        <h3 className="data-table-title">Make Activate</h3>
                        <div className="buttons-container">
                            <button type="submit" className="form-submit" onClick={fetchActiveCustomers}>Get All Active Customers</button>
                            <button type="submit" className="form-submit" onClick={fetchInactiveCustomers}>Get All Inactive Customers</button>
                        </div>
                    </div>
                    <div className='activate-form'>
                        <form>
                            <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                            <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>Make Particular Customer {showActiveCustomers ? 'Inactive' : 'Active'}</button>
                        </form>
                        <h3 className='or-divider'>OR</h3>
                    </div>
                    <div className="deactivate-button-container">
                        <button type="submit" className="form-submit-deactivation" onClick={(event) => handleActivateCustomers(event)}>
                            Activate All the Customers who have made the requests
                        </button>
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
                        <h3 className="data-table-title">{showActiveCustomers ? 'Active Customers' : 'Inactive Customers'}</h3>
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={false}
                            handleButtonClick={null}
                            handleRowClicked={handleCustomerClicked}
                        />
                    </div>
                </section>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    )
}
