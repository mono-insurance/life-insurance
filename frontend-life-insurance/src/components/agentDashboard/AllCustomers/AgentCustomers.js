import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AgentCustomers.scss'
import { useParams } from 'react-router-dom';
import { getAllCustomers } from '../../../services/AgentService';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AgentCustomers = () => {
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

    const handleCustomerClicked = (customer) => {
        navigate(`/customer/${customer.customerId}`)
    }

    const fetchActiveCustomers = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
                isActive: true
            }
            const response = await getAllCustomers(formData);
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
                isActive: false
            }
            const response = await getAllCustomers(formData);
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
                        <div className="buttons-container">
                            <button type="submit" className="form-submit" onClick={fetchActiveCustomers}>Get All Active Customers</button>
                            <button type="submit" className="form-submit" onClick={fetchInactiveCustomers}>Get All Inactive Customers</button>
                        </div>
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
