// import React, { useContext, useEffect, useState } from 'react'
// import { AreaTop } from '../../../sharedComponents/Title/Title'
// import { errorToast, successToast } from '../../../utils/helper/toast';
// import { NotFoundError } from '../../../utils/errors/APIError';
// import { PaginationContext } from '../../../context/PaginationContext';
// import { Table } from '../../../sharedComponents/Table/Table';
// import './AllCommissions.scss'
// import { useParams } from 'react-router-dom';
// import { getAllApprovedCommissions, getAllNotApprovedCommissions, reviewCommissionWithdrawalRequest, deleteAgent } from '../../../services/EmployeeServices';
// import { validatewithdrawalId } from '../../../utils/validations/Validations';
// import { Toast } from 'react-bootstrap';
// import { ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// export const AllCommissions = () => {
//     const navigate = useNavigate()
//     const [newlyActivated, setNewlyActivated] = useState(false);
//     const [activatedData, setActivatedData] = useState('');
//     const [data, setData] = useState([]);
//     const [showApprovedWithdrawals, setShowApprovedWithdrawals] = useState(true);
//     const [showNotApprovedWithdrawals, setShowNotApprovedWithdrawals] = useState(false);
//     const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
//     const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
//     const [withdrawalId, setWithdrawalId] = useState('');
//     const routeParams = useParams();


//     const handleFormSubmit = async (e) => {
//         e.preventDefault();
//         console.log("current action ", showApprovedWithdrawals)
//         try {
//             {
//                 !showApprovedWithdrawals &&
//                     await reviewCommissionWithdrawalRequest(withdrawalId, true);

//                 successToast("Customer has been activated successfully!");
//                 fetchApprovedCommissions()
//                 setWithdrawalId('');
//             }
//             {
//                 showApprovedWithdrawals &&
//                     await reviewCommissionWithdrawalRequest(withdrawalId, false);
//                 fetchNotApprovedCommissions()
//                 successToast("Customer has been deleted successfully!");
//                 setWithdrawalId('');
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
//     const handleAgentClicked = (agent) => {
//         navigate(`/agent/${agent.withdrawalId}`)
//     }

//     const fetchApprovedCommissions = async () => {
//         console.log("in fetchApprovedCommissions")
//         try {
//             const agentId = routeParams.id
//             const formData = {
//                 pageNo: 0,
//                 size: 10,
//                 sort: 'ASC',
//             }

//             const response = await getAllApprovedCommissions(agentId, formData);
//             console.log("in fetchApprovedCommissions after response", response)
//             console.log("in active customer click", response?.data ?? [])
//             setData(response?.data ?? []);
//             console.log("data in response", data)
//             console.log("data in response", data)

//             setKeysToBeIncluded(["withdrawalRequestsId", "agentName", "customerName", "requestType", "amount"]);
//             setShowApprovedWithdrawals(true);
//             setShowNotApprovedWithdrawals(false);
//         }
//         catch (error) {
//             setData([]);
//             if (error.response?.data?.message || error.specificMessage) {
//                 errorToast(error.response?.data?.message || error.specificMessage);
//             } else {
//                 errorToast("An error occurred while Activating customers.");
//             }
//         }
//     }

//     const fetchNotApprovedCommissions = async () => {
//         try {
//             const agentId = routeParams.id
//             const formData = {
//                 pageNo: 0,
//                 size: 10,
//                 sort: 'ASC',
//             }
//             const response = await getAllNotApprovedCommissions(agentId, formData);
//             console.log("fetchNotApprovedCommissions ", response)
//             setData(response?.data ?? []);
//             console.log("fetchNotApprovedCommissions is in data", data)

//             setKeysToBeIncluded(["withdrawalRequestsId", "agentName", "customerName", "requestType", "amount"]);
//             setShowNotApprovedWithdrawals(true);
//             setShowApprovedWithdrawals(false);
//         }
//         catch (error) {
//             setData([]);
//             if (error.response?.data?.message || error.specificMessage) {
//                 errorToast(error.response?.data?.message || error.specificMessage);
//             } else {
//                 errorToast("An error occurred while Activating customers.");
//             }
//         }
//     }


//     useEffect(() => {
//         if (showApprovedWithdrawals) {
//             fetchApprovedCommissions();
//         }
//         else if (showNotApprovedWithdrawals) {
//             fetchNotApprovedCommissions();
//         }
//         else{
//             fetchApprovedCommissions();
//         }
//         console.log("data in checking is", data)
//     }, [currentPage, itemsPerPage]);


//     useEffect(() => {
//         resetPagination();
//     }, []);

//     useEffect(() => {
//         resetPagination();
//     }, [showApprovedWithdrawals, showNotApprovedWithdrawals]);

//     return (
//         <div className='content-area'>
//             <AreaTop pageTitle={"All Commissions"} pagePath={"agent-commissions"} pageLink={`/employee/dashboard/${routeParams.id}`} />
//             <section className='content-area-form'>
//                 <div className="admin-form">
//                     <div className="data-info">
//                         <h3 className="data-table-title">withdrawal requests</h3>
//                         <div className="buttons-container">
//                             <button type="submit" className="form-submit" onClick={fetchApprovedCommissions}>Get Approved withdrawals</button>
//                             <button type="submit" className="form-submit" onClick={fetchNotApprovedCommissions}>Get Not Approved withdrawals</button>
//                         </div>
//                     </div>
//                     <div className='activate-form'>
//                         <form>
//                             <input type="number" name="withdrawalId" value={withdrawalId} onChange={(e) => setWithdrawalId(e.target.value)} className="form-input-form" placeholder='Enter withdrawal ID' required />
//                             <button type="submit" className="form-submit-form" disabled={showApprovedWithdrawals} onClick={(event) => handleFormSubmit(event)}>Approve Request</button>
//                         </form>
//                     </div>


//                     {newlyActivated && (
//                         <div className="deactivate-success">
//                             {activatedData}
//                         </div>
//                     )}

//                 </div>
//             </section>

//             {(showApprovedWithdrawals || showNotApprovedWithdrawals) && (
//                 <section className="content-area-table">
//                     <div className="data-table-info">
//                         <h3 className="data-table-title">{showApprovedWithdrawals ? 'Approved Withdrawals' : 'Not Approved Withdrawals'}</h3>
//                     </div>
//                     <div className="data-table-diagram">
//                         <Table
//                             data={data}
//                             keysToBeIncluded={keysToBeIncluded}
//                             includeButton={false}
//                             handleButtonClick={null}
//                             handleRowClicked={handleAgentClicked}
//                         />
//                     </div>
//                 </section>
//             )}
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
import { getAllApprovedCommissions, getAllNotApprovedCommissions, reviewCommissionWithdrawalRequest } from '../../../services/EmployeeServices';


export const AllCommissions = () => {
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
        { label: 'withdrawal id', value: 'id' },
        { label: 'approved', value: 'active' },
        { label: 'not approved', value: 'inactive' }
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

    const actions = (policyAccountId) => [
        { name: "View", url: `/employee/policy-account/${routeParams.id}/view/${policyAccountId}` }
    ]



    const customerTable = async () => {
        try {
            let response = {};
            const formData = {
                page: currentPage - 1,
                size: itemsPerPage
            }
            const empId = routeParams.id

            if (filterType === 'active') {

                response = await getAllApprovedCommissions(empId, formData);
            }
            else if (filterType === 'inactive') {
                response = await getAllNotApprovedCommissions(empId, formData);
            }

            else {
                response = await getAllApprovedCommissions(empId, formData);
            }
            setData(response);
            setKeysToBeIncluded(["withdrawalRequestsId", "agentName", "isApproved", "isWithdraw", "requestType", "amount"]);
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
    const handleActivateCustomer = async (e) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("custeomr id s", customerId)
        await reviewCommissionWithdrawalRequest(customerId)
        setCustomerId('')
        customerTable()
    }
    return (
        <>
            <div className='content-area-customers'>
                <AreaTop pageTitle={"Get All Commissions"} pagePath={"Commissions"} pageLink={`/employee/dashboard/${routeParams.id}`} />
                <section className="content-area-table-customers">
                {
                                    filterType == 'inactive' &&
                    <div className="admin-form">
                        <div className='activate-form' hidden={filterType == ''}>
                            <form>
                               
                                    <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter account number' required />
                                
                                    <button type="submit" className="form-submit-form" onClick={(event) => handleActivateCustomer(event)}>Approve Commission</button>
                            </form>
                        </div>
                    </div>
}

                    <div className="data-table-information">
                        <h3 className="data-table-title">Commissions</h3>
                        {showFilterButton && (
                            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
                        )}
                        {(filterType === 'active' || filterType === 'inactive' || filterType === 'id') && (
                            <div className="filter-container">
                                {filterType === 'id' && (
                                    <div className="filter">
                                        <input type="number" placeholder="Enter commission id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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
                            includeButton={false}
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

