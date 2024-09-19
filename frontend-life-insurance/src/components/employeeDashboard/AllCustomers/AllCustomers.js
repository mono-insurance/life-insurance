import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AllCustomers.scss'
import { useParams } from 'react-router-dom';
import { activateCustomer, getCustomerById, activateParticularCustomer, deleteCustomer, getAllActiveCustomers, getAllInactiveCustomers, makeAllRequestsCustomerActivate } from '../../../services/EmployeeServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { covertIdDataIntoTable } from '../../../services/SharedServices';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';

export const AllCustomers = () => {
    const navigate = useNavigate()

    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showActiveCustomers, setShowActiveCustomers] = useState(true);
    const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const routeParams = useParams();
    const [filterType, setFilterType] = useState('');
    const [filter, setFilter] = useState(false);
    const [id, setId] = useState('');
    const [active, setActive] = useState('');
    const [showPagination, setShowPagination] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentPage, itemsPerPage, resetPagination, handleItemsPerPageChange, handlePageChange } =
        useContext(PaginationContext);
    const [showFilterButton, setShowFilterButton] = useState(true);

    const filterOptions = [
        { label: 'Search by customerId Id', value: 'id' },
        { label: 'Search by Active', value: 'active' },
        { label: 'Search by Inactive', value: 'inactive' }
    ];
    const handleReset = () => {
        setFilterType('');
        setId('');
        setActive('');
        setShowFilterButton(true);
        resetPagination();
        setFilter(false);
        setShowPagination(true);
        setSearchParams({});
    };


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
            customerTable()


        }
        catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An error occurred while Activating customer.");
            }
        }
    }
    const handleDeleteCustomer = async (customerId) => {
        console.log("in handleDeleteCustomer")
        await deleteCustomer(customerId)
        customerTable()
    }
    const actions = (customerId) => [
        { name: "View", url: `/employee/${routeParams.id}/customer/settings/${customerId}` }
    ]
    const handleSearch = () => {
        resetPagination();
        if (filterType === 'id') {
            setSearchParams({ filterType, id });
            setShowPagination(false);
        }
        if (filterType === 'active') {
            setSearchParams({ filterType, active, currentPage, itemsPerPage });
            setShowPagination(true);
            setShowActiveCustomers(true)
        }
        if (filterType === 'inactive') {
            setSearchParams({ filterType, active, currentPage, itemsPerPage });
            setShowPagination(true);
            setShowActiveCustomers(false)
        }
        if (filter === false) {
            setFilter(true);
        }
        else {
            customerTable();
        }
    }
    const customerTable = async () => {
        try {
            const formData = {
                currentPage: currentPage,
                itemsPerPage: itemsPerPage
            }
            let response = {};

            if (filterType === 'active') {
                response = await getAllActiveCustomers(formData);
            }
            else if (filterType === 'inactive') {
                response = await getAllInactiveCustomers(formData);
            }
            else if (filterType === 'id') {
                validateCustomerId(id);
                const data = await getCustomerById(id);
                response = covertIdDataIntoTable(data);
            }
            else {
                console.log("in default customers ")
                response = await getAllActiveCustomers(formData);
            }

            setData(response);
            setKeysToBeIncluded(["id", "firstName", "username", "email", "mobileNumber", "dateOfBirth", "qualification"]);

        } catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            } else {
                errorToast("An unexpected error occurred. Please try again later.");
            }
        }
    };



    useEffect(() => {
        customerTable()
    }, [filter, currentPage, itemsPerPage, searchParams]);


    return (
        <>
            <div className='content-area-employees'>
                <AreaTop pageTitle={"All Customers"} pagePath={"Customers"} pageLink={`/employee/dashboard/${routeParams.id}`} />
                <section className="content-area-table-employees">
                    <div className="admin-form">
                        <div className='activate-form'>
                            <form>
                                <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                                <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>{showActiveCustomers ? 'Delete' : 'Activate'} Customer</button>
                            </form>

                        </div>
                    </div>
                    <div className="data-table-information">
                        <h3 className="data-table-title">Employees</h3>

                        {showFilterButton && (
                            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                        )}
                        {(filterType === 'active' || filterType === 'inactive' || filterType === 'id') && (
                            <div className="filter-container">
                                {filterType === 'id' && (
                                    <div className="filter">
                                        <input type="number" placeholder="Enter Employee Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
                                    </div>
                                )}
                                <div className="filter-buttons">
                                    <button className="form-submit-b" onClick={handleSearch}>Search</button>
                                    <button className="form-submit-b" onClick={handleReset}>Clear</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={true}
                            handleButtonClick={actions}
                            showPagination={showPagination}
                        />
                    </div>
                </section>

            </div>
            <ToastContainer position="bottom-right" />
        </>
    )
}
