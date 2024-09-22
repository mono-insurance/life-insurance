// import React, { useContext, useEffect, useState } from 'react'
// import { AreaTop } from '../../../sharedComponents/Title/Title'
// import { errorToast, successToast } from '../../../utils/helper/toast';
// import { NotFoundError } from '../../../utils/errors/APIError';
// import { PaginationContext } from '../../../context/PaginationContext';
// import { Table } from '../../../sharedComponents/Table/Table';
// import './AllAgents.scss'
// import { useParams } from 'react-router-dom';
// import { activateAgent, deleteAgent, getAllActiveAgents, getAllInActiveAgents } from '../../../services/EmployeeServices';
// import { validateagentId } from '../../../utils/validations/Validations';
// import { Toast } from 'react-bootstrap';
// import { ToastContainer } from 'react-toastify';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { getAgentsById } from '../../../services/AdminServices';
// import { covertIdDataIntoTable } from '../../../services/SharedServices';
// import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';

// export const AllAgents = () => {
//     const navigate = useNavigate()
//     const [newlyActivated, setNewlyActivated] = useState(false);
//     const [activatedData, setActivatedData] = useState('');
//     const [data, setData] = useState([]);
//     const [showActiveAgents, setShowActiveAgents] = useState(true);
//     const [showInActiveAgents, setShowInActiveAgents] = useState(false);
//     const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
//     const routeParams = useParams();
//     const [filterType, setFilterType] = useState('');
//     const [filter, setFilter] = useState(false);
//     const [id, setId] = useState('');
//     const [active, setActive] = useState('');
//     const [agentId, setAgentId] = useState('');
//     const [showPagination, setShowPagination] = useState(true);
//     const [searchParams, setSearchParams] = useSearchParams();
//     const { currentPage, itemsPerPage, resetPagination, handleItemsPerPageChange, handlePageChange } =
//         useContext(PaginationContext);
//     const [showFilterButton, setShowFilterButton] = useState(true);
//     const [showActiveCustomers, setShowActiveCustomers] = useState(true);

//     const filterOptions = [
//         { label: 'Search by agent Id', value: 'id' },
//         { label: 'Search by Active', value: 'active' },
//         { label: 'Search by Inactive', value: 'inactive' }
//     ];
//     const handleReset = () => {
//         setFilterType('');
//         setId('');
//         setActive('');
//         setShowFilterButton(true);
//         resetPagination();
//         setFilter(false);
//         setShowPagination(true);
//         setSearchParams({});
//     };
//     const handleSearch = () => {
//         resetPagination();
//         if (filterType === 'id') {
//             setSearchParams({ filterType, id });
//             setShowPagination(false);
//         }
//         if (filterType === 'active') {
//             setSearchParams({ filterType, active, currentPage, itemsPerPage });
//             setShowPagination(true);
//             setShowActiveCustomers(true)
//         }
//         if (filterType === 'inactive') {
//             setSearchParams({ filterType, active, currentPage, itemsPerPage });
//             setShowPagination(true);
//             setShowActiveCustomers(false)
//         }
//         if (filter === false) {
//             setFilter(true);
//         }
//         else {
//             agentTable();
//         }
//     }
//     const agentTable = async () => {
//         try {
//             const formData = {
//                 currentPage: currentPage,
//                 itemsPerPage: itemsPerPage
//             }
//             let response = {};

//             if (filterType === 'active') {
//                 response = await getAllActiveAgents(formData);
//                 setShowActiveAgents(true)
//             }
//             else if (filterType === 'inactive') {
//                 response = await getAllInActiveAgents(formData);
//                 setShowActiveAgents(false)
//             }
//             else if (filterType === 'id') {
//                 const data = await getAgentsById(id);
//                 response = covertIdDataIntoTable(data);
//             }
//             else {
//                 console.log("in default customers ")
//                 response = await getAllActiveAgents(formData);
//             }

//             setData(response);
//             setKeysToBeIncluded(["agentId", "firstName", "qualification", "isActive", "balance", "withdrawalAmount", "qualification"]);

//         } catch (error) {
//             setData([]);
//             if (error.response?.data?.message || error.specificMessage) {
//                 errorToast(error.response?.data?.message || error.specificMessage);
//             } else {
//                 errorToast("An unexpected error occurred. Please try again later.");
//             }
//         }
//     };



//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         console.log("current action ", showActiveAgents)
//         try {
//             {
//                 !showActiveAgents &&
//                     await activateAgent(agentId);

//                 successToast("Customer has been activated successfully!");
//                 agentTable()
//                 setAgentId('');
//             }
//             {
//                 showActiveAgents &&
//                     await deleteAgent(agentId);
//                 agentTable()
//                 successToast("Customer has been deleted successfully!");
//                 setAgentId('');
//             }


//         }
//         catch (error) {
//             if (error.response?.data?.message || error.specificMessage) {
//                 errorToast(error.response?.data?.message || error.specificMessage);
//             } else {
//                 errorToast("An error occurred while Activating customer.");
//             }
//         }
//     }
//     const actions = (agentId) => [
//         { name: "View", url: `/employee/${routeParams.id}/agent/profile/${agentId}` }
//     ]



//     useEffect(() => {
//         agentTable()
//         console.log("data in checking is", data)
//     }, [filter, currentPage, itemsPerPage, searchParams]);


//     useEffect(() => {

//         resetPagination();
//     }, []);
//     return (
//         <div className='content-area'>
//             <AreaTop pageTitle={"Agents"} pagePath={"Agents"} pageLink={`/employee/dashboard/${routeParams.id}`} />
//             <section className="content-area-table-employees">
//                 <div className="admin-form">
//                     <div className='activate-form'>
//                         <form>
//                             <input type="number" name="agentId" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
//                             <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>{showActiveAgents ? 'Delete' : 'Activate'} Customer</button>
//                         </form>

//                     </div>
//                 </div>
//                 <div className="data-table-information">
//                     <h3 className="data-table-title">Employees</h3>

//                     {showFilterButton && (
//                         <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
//                     )}
//                     {(filterType === 'active' || filterType === 'inactive' || filterType === 'id') && (
//                         <div className="filter-container">
//                             {filterType === 'id' && (
//                                 <div className="filter">
//                                     <input type="number" placeholder="Enter Employee Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
//                                 </div>
//                             )}
//                             <div className="filter-buttons">
//                                 <button className="form-submit-b" onClick={handleSearch}>Search</button>
//                                 <button className="form-submit-b" onClick={handleReset}>Clear</button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//                 <div className="data-table-diagram">
//                     <Table
//                         data={data}
//                         keysToBeIncluded={keysToBeIncluded}
//                         includeButton={true}
//                         handleButtonClick={actions}
//                         showPagination={showPagination}
//                     />
//                 </div>
//             </section>
//             <ToastContainer position="bottom-right" />
//         </div>
//     )
// }

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
                response = await getAgentsById(id);
             
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
            <div className='content-area-customers'>
                <AreaTop pageTitle={"Get All Agents"} pagePath={"Agent"} pageLink={`/employee/dashboard/${routeParams.id}`} />
                <section className="content-area-table-customers">

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