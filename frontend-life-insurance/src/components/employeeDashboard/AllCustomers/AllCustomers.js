import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getCustomers.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { activateCustomer, deleteCustomer, getAllActiveCustomers, getAllCustomers, getAllInactiveCustomers, getCustomerById } from '../../../services/EmployeeServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../services/SharedServices';
import { validateCustomerId, validateFirstName } from '../../../utils/validations/Validations';


export const AllCustomers = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState({});
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const routeParams = useParams();
    const [showFilterButton, setShowFilterButton] = useState(true);
    const [filterType, setFilterType] = useState('');
    const [filter, setFilter] = useState(false);
    const [id, setId] = useState('');
    const [active, setActive] = useState('');
    const [showPagination, setShowPagination] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [customerId, setCustomerId] = useState(null)
    const filterOptions = [
        { label: 'Search by Customer Id', value: 'id' },
        { label: 'Search by Active', value: 'active' },
        { label: 'Search by Inactive', value: 'inactive' }
    ];


    const resetPagination = () => {
        setCurrentPage(1);
        setItemsPerPage(10);
    };

    const handleSearch = () => {
        resetPagination();
        if (filterType === 'id') {
            setSearchParams({ filterType, id });
            setShowPagination(false);
        }
        if (filterType === 'active') {
            setSearchParams({ filterType, active, currentPage, itemsPerPage });
            setShowPagination(true);
        }
        if (filterType === 'inactive') {
            setSearchParams({ filterType, active, currentPage, itemsPerPage });
            setShowPagination(true);
        }
        if (filter === false) {
            setFilter(true);
        }
        else {
            customerTable();
        }
    }

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

    const actions = (customerId) => [
        { name: "View", url: `/employee/${routeParams.id}/customer/settings/${customerId}` }
    ]



    const customerTable = async () => {
        try {
            let response = {};
            const formData = {
                page: currentPage - 1,
                size: itemsPerPage
            }

            if (filterType === 'active') {

                response = await getAllActiveCustomers(formData);
            }
            else if (filterType === 'inactive') {
                response = await getAllInactiveCustomers(formData);
            }
            else if (filterType === 'id') {
                validateCustomerId(id);
                response= await getCustomerById(id);
            }
            else {
                response = await getAllCustomers(currentPage, itemsPerPage);
            }

            setData(response);
            setKeysToBeIncluded(["customerId", "firstName", "lastName", "gender", "dateOfBirth", "isActive"]);

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
        customerTable();

    }, [filter, currentPage, itemsPerPage, searchParams]);

    const handleDeleteCustomer = async (e) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("custeomr id s", customerId)
        await deleteCustomer(customerId)
        customerTable()
    }
    const handleActivateCustomer = async (e) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("custeomr id s", customerId)
        await activateCustomer(customerId)
        customerTable()
    }


    return (
        <>
            <div className='content-area-customers'>
                <AreaTop pageTitle={"Get All Customers"} pagePath={"Customer"} pageLink={`/employee/dashboard/${routeParams.id}`} />
                <section className="content-area-table-customers">

                    <div className="admin-form">
                        <div className='activate-form' hidden={filterType == ''}>
                            <form>
                                <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                                {
                                    filterType == 'active' ?
                                        <button type="submit" className="form-submit-form" onClick={(event) => handleDeleteCustomer(event)}>Delete Customer</button>
                                        :
                                        <button type="submit" className="form-submit-form" onClick={(event) => handleActivateCustomer(event)}>Activate Customer </button>
                                }
                            </form>
                        </div>
                    </div>

                    <div className="data-table-information">
                        <h3 className="data-table-title">Customers</h3>
                        {showFilterButton && (
                            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                        )}
                        {(filterType === 'active' || filterType === 'inactive' || filterType === 'id') && (
                            <div className="filter-container">
                                {filterType === 'id' && (
                                    <div className="filter">
                                        <input type="number" placeholder="Enter Customer Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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
                            currentPage={currentPage}
                            pageSize={itemsPerPage}
                            setPage={setCurrentPage}
                            setPageSize={setItemsPerPage}
                        />
                    </div>
                </section>

            </div>
            <ToastContainer position="bottom-right" />
        </>

    )
}