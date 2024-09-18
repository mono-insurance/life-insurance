import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AllCommissions.scss'
import { useParams } from 'react-router-dom';
import { getAllApprovedCommissions, getAllNotApprovedCommissions, reviewCommissionWithdrawalRequest, deleteAgent } from '../../../services/EmployeeServices';
import { validatewithdrawalId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AllCommissions = () => {
    const navigate = useNavigate()
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showApprovedWithdrawals, setShowApprovedWithdrawals] = useState(true);
    const [showNotApprovedWithdrawals, setShowNotApprovedWithdrawals] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [withdrawalId, setWithdrawalId] = useState('');
    const routeParams = useParams();


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("current action ", showApprovedWithdrawals)
        try {
            {
                !showApprovedWithdrawals &&
                    await reviewCommissionWithdrawalRequest(withdrawalId, true);

                successToast("Customer has been activated successfully!");
                fetchApprovedCommissions()
                setWithdrawalId('');
            }
            {
                showApprovedWithdrawals &&
                    await reviewCommissionWithdrawalRequest(withdrawalId, false);
                fetchNotApprovedCommissions()
                successToast("Customer has been deleted successfully!");
                setWithdrawalId('');
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
    const handleAgentClicked = (agent) => {
        navigate(`/agent/${agent.withdrawalId}`)
    }

    const fetchApprovedCommissions = async () => {
        console.log("in fetchApprovedCommissions")
        try {
            const agentId = routeParams.id
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }

            const response = await getAllApprovedCommissions(agentId, formData);
            console.log("in fetchApprovedCommissions after response", response)
            console.log("in active customer click", response?.data ?? [])
            setData(response?.data ?? []);
            console.log("data in response", data)
            console.log("data in response", data)

            setKeysToBeIncluded(["withdrawalRequestsId", "requestType", "amount"]);
            setShowApprovedWithdrawals(true);
            setShowNotApprovedWithdrawals(false);
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

    const fetchNotApprovedCommissions = async () => {
        try {
            const agentId = routeParams.id
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllNotApprovedCommissions(agentId, formData);
            console.log("fetchNotApprovedCommissions ", response)
            setData(response?.data ?? []);
            console.log("fetchNotApprovedCommissions is in data", data)

            setKeysToBeIncluded(["withdrawalRequestsId", "requestType", "amount"]);
            setShowNotApprovedWithdrawals(true);
            setShowApprovedWithdrawals(false);
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
        if (showApprovedWithdrawals) {
            fetchApprovedCommissions();
        }
        if (showNotApprovedWithdrawals) {
            fetchNotApprovedCommissions();
        }
        console.log("data in checking is", data)
    }, [currentPage, itemsPerPage]);


    useEffect(() => {
        resetPagination();
    }, []);

    useEffect(() => {
        resetPagination();
    }, [showApprovedWithdrawals, showNotApprovedWithdrawals]);

    return (
        <div className='content-area'>
            <AreaTop pageTitle={"All Commissions"} pagePath={"agent-commissions"} pageLink={`/employee/dashboard/${routeParams.id}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
                        <h3 className="data-table-title">withdrawal requests</h3>
                        <div className="buttons-container">
                            <button type="submit" className="form-submit" onClick={fetchApprovedCommissions}>Get Approved withdrawals</button>
                            <button type="submit" className="form-submit" onClick={fetchNotApprovedCommissions}>Get Not Approved withdrawals</button>
                        </div>
                    </div>
                    <div className='activate-form'>
                        <form>
                            <input type="number" name="withdrawalId" value={withdrawalId} onChange={(e) => setWithdrawalId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                            <button type="submit" className="form-submit-form" disabled={showApprovedWithdrawals} onClick={(event) => handleFormSubmit(event)}>Approve Request</button>
                        </form>
                    </div>


                    {newlyActivated && (
                        <div className="deactivate-success">
                            {activatedData}
                        </div>
                    )}

                </div>
            </section>

            {(showApprovedWithdrawals || showNotApprovedWithdrawals) && (
                <section className="content-area-table">
                    <div className="data-table-info">
                        <h3 className="data-table-title">{showApprovedWithdrawals ? 'Approved Withdrawals' : 'Not Approved Withdrawals'}</h3>
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={false}
                            handleButtonClick={null}
                            handleRowClicked={handleAgentClicked}
                        />
                    </div>
                </section>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    )
}
