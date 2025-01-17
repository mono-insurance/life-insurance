
import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getCustomers.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../services/SharedServices';
import { validateCustomerId, validateFirstName } from '../../../utils/validations/Validations';
import { activateAgent, deleteAgent, getAllActiveAgents, getAllInActiveAgents, getAgentById } from '../../../services/EmployeeServices';
import { generateAllAccountReceipts, generateAllAgentsReceipts } from '../../../services/AgentService';
import { Loader } from '../../../sharedComponents/Loader/Loader';


export const AllAgents = () => {
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

    const [showOptions, setShowOptions] = useState(false);
    const handleDownload = async (event, format) => {
        event.preventDefault();
        try {
            const formData = {
                page: currentPage - 1,
                size: itemsPerPage,
                isActive: true
            }
            if (filterType == 'inactive') formData['isActive'] = false
            console.log(formData)
            const response = await generateAllAgentsReceipts(formData, format);

            const pdfUrl = URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', `agents.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
            errorToast(errorMessage);
        }
    };
    const filterOptions = [
        { label: 'Search by Agent Id', value: 'id' },
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

    const actions = (agentId) => [
        { name: "View", url: `/employee/${routeParams.id}/agent/profile/${agentId}` }
    ]


    const [loading, setLoading] = useState(true)
    const customerTable = async () => {
        try {
            let response = {};
            console.log("in agent customer table")
            const formData = {
                page: currentPage - 1,
                size: itemsPerPage
            }
            if (filterType === 'active') {
                response = await getAllActiveAgents(formData);
            }
            else if (filterType === 'inactive') {
                response = await getAllInActiveAgents(formData);
            }
            else if (filterType === 'id') {
                validateCustomerId(id);
                const data = await getAgentById(id, formData);
                response = covertIdDataIntoTable(data);
            }
            else {
                console.log("in agent customer table in else")
                response = await getAllActiveAgents(formData);
                console.log("in agent customer table after else")
            }

            setData(response);
            setKeysToBeIncluded(["agentId", "firstName", "lastName", "username", "email", "mobileNumber", "isActive", "isApproved"]);


        } catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            }
        }
        setLoading(false)
    };

    useEffect(() => {
        customerTable();
    }, [filter, currentPage, itemsPerPage, searchParams]);

    const handleDeleteCustomer = async (e) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("custeomr id s", customerId)
        await deleteAgent(customerId)
        customerTable()
    }
    const handleActivateCustomer = async (e) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("custeomr id s", customerId)
        await activateAgent(customerId)
        customerTable()
    }


    return (
        <>

            {loading && <Loader />}
            <div className='content-area-customers'>
                <AreaTop pageTitle={"Get All Agents"} pagePath={"Agent"} pageLink={`/employee/dashboard/${routeParams.id}`} />
                <section className="content-area-table-customers">
                    {data &&
                        <button className="bg-indigo-500 text-white py-1 px-2 rounded-md" onClick={(e) => setShowOptions(!showOptions)}>Download Agents</button>
                    }
                    {showOptions && (
                        <div className="absolute mt-2 bg-white border rounded shadow-lg">
                            <button
                                onClick={(e) => handleDownload(e, 'csv')}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                Download CSV
                            </button>
                            <button
                                onClick={(e) => handleDownload(e, 'pdf')}
                                className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                            >
                                Download PDF
                            </button>
                        </div>
                    )}

                    <div className="admin-form">
                        <div className='activate-form' hidden={filterType == ''}>
                            <form>
                                <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Agent ID' required />
                                {
                                    filterType == 'active' ?
                                        <button type="submit" className="form-submit-form" onClick={(event) => handleDeleteCustomer(event)}>Delete Agent</button>
                                        :
                                        <button type="submit" className="form-submit-form" onClick={(event) => handleActivateCustomer(event)}>Activate Agent </button>
                                }
                            </form>
                        </div>
                    </div>

                    <div className="data-table-information">
                        <h3 className="data-table-title">Agents</h3>
                        {showFilterButton && (
                            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                        )}
                        {(filterType === 'active' || filterType === 'inactive' || filterType === 'id') && (
                            <div className="filter-container">
                                {filterType === 'id' && (
                                    <div className="filter">
                                        <input type="number" placeholder="Enter Agent Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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