import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AffTransactions.scss'
import { useParams } from 'react-router-dom';
import { getAllTransactionsByAccountNumber, getAllTransactionsByDate } from '../../../services/EmployeeServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { getAllTransactions } from '../../../services/AgentService';

export const AffTransactions = () => {
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showActiveCustomers, setShowActiveCustomers] = useState(false);
    const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [customerId, setCustomerId] = useState('');
    const routeParams = useParams();

    const fetchAllTransactions = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllTransactions(formData);
            console.log("in active customer click", response?.data.content ?? [])
            setData(response?.data ?? []);
            console.log("data in response", data)

            setKeysToBeIncluded(["transactionId", "amount", "transactionDate", "status", "policyAccountId"]);
            setShowActiveCustomers(true);
            setShowInactiveCustomers(false);
        }
        catch (error) {
            setData([]);
            if (error.response?.data?.message || error.specificMessage) {
                errorToast(error.response?.data?.message || error.specificMessage);
            }
        }
    }
    useEffect(() => {
        fetchAllTransactions();
    }, [currentPage, itemsPerPage]);
    return (
        <div className='content-area'>
            <AreaTop pageTitle={"All Transactions"} pagePath={"customer-transactions"} pageLink={`/agent/dashboard/${routeParams.aid}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
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
                        <h3 className="data-table-title">All Transactions</h3>
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
