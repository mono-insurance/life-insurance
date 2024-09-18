import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AllAgents.scss'
import { useParams } from 'react-router-dom';
import { activateAgent, deleteAgent, getAllActiveAgents, getAllInActiveAgents } from '../../../services/EmployeeServices';
import { validateagentId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AllAgents = () => {
    const navigate = useNavigate()
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showActiveAgents, setShowActiveAgents] = useState(true);
    const [showInActiveAgents, setShowInActiveAgents] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [agentId, setAgentId] = useState('');
    const routeParams = useParams();


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("current action ", showActiveAgents)
        try {
            {
                !showActiveAgents &&
                    await activateAgent(agentId);

                successToast("Customer has been activated successfully!");
                fetchActiveAgents()
                setAgentId('');
            }
            {
                showActiveAgents &&
                    await deleteAgent(agentId);
                fetchInActiveAgents()
                successToast("Customer has been deleted successfully!");
                setAgentId('');
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
        navigate(`/agent/${agent.agentId}`)
    }

    const fetchActiveAgents = async () => {
        console.log("in fetchActiveAgents")
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }

            const response = await getAllActiveAgents(formData);
            console.log("in fetchActiveAgents after response", response)
            console.log("in active customer click", response?.data ?? [])
            setData(response?.data ?? []);
            console.log("data in response", data)
            console.log("data in response", data)

            setKeysToBeIncluded(["agentId", "firstName", "dateOfBirth", "qualification", "withdrawalAmount"]);
            setShowActiveAgents(true);
            setShowInActiveAgents(false);
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

    const fetchInActiveAgents = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllInActiveAgents(formData);
            console.log("fetchInActiveAgents ", response)
            setData(response?.data ?? []);
            console.log("fetchInActiveAgents is in data", data)

            setKeysToBeIncluded(["agentId", "firstName", "dateOfBirth", "qualification", "withdrawalAmount"]);
            setShowInActiveAgents(true);
            setShowActiveAgents(false);
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
        if (showActiveAgents) {
            fetchActiveAgents();
        }
        if (showInActiveAgents) {
            fetchInActiveAgents();
        }
        console.log("data in checking is", data)
    }, [currentPage, itemsPerPage]);


    useEffect(() => {
        resetPagination();
    }, []);

    useEffect(() => {
        resetPagination();
    }, [showActiveAgents, showInActiveAgents]);

    return (
        <div className='content-area'>
            <AreaTop pageTitle={"Agents"} pagePath={"Agents"} pageLink={`/employee/dashboard/${routeParams.id}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
                        <h3 className="data-table-title">Make Activate</h3>
                        <div className="buttons-container">
                            <button type="submit" className="form-submit" onClick={fetchActiveAgents}>Get All Active Agents</button>
                            <button type="submit" className="form-submit" onClick={fetchInActiveAgents}>Get All Inactive Agents</button>
                        </div>
                    </div>
                    <div className='activate-form'>
                        <form>
                            <input type="number" name="agentId" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="form-input-form" placeholder='Enter Agent ID' required />
                            <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>{showActiveAgents ? 'Delete' : 'Activate'} Agent</button>
                        </form>
                    </div>


                    {newlyActivated && (
                        <div className="deactivate-success">
                            {activatedData}
                        </div>
                    )}

                </div>
            </section>

            {(showActiveAgents || showInActiveAgents) && (
                <section className="content-area-table">
                    <div className="data-table-info">
                        <h3 className="data-table-title">{showActiveAgents ? 'Active Agents' : 'InActive Agents'}</h3>
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
