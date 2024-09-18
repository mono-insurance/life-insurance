import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './AllDocuments.scss'
import { useParams } from 'react-router-dom';
import { getAllApprovedDocuments, getAllNotApprovedDocuments, approveDocument, downloadDocument } from '../../../services/EmployeeServices';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AllDocuments = () => {
    const navigate = useNavigate()
    const [newlyActivated, setNewlyActivated] = useState(false);
    const [activatedData, setActivatedData] = useState('');
    const [data, setData] = useState([]);
    const [showApproveDocument, setShowApproveDocument] = useState(true);
    const [showNotApproveDocument, setShowNotApproveDocument] = useState(false);
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const { currentPage, itemsPerPage, resetPagination } = useContext(PaginationContext);
    const [documentId, setDocumentId] = useState('');
    const routeParams = useParams();


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("current action ", showApproveDocument)
        try {
            {
                !showApproveDocument &&
                    await approveDocument(documentId, false);

                successToast("Customer has been activated successfully!");
                setDocumentId('');
            }
            {
                showApproveDocument &&
                    await approveDocument(documentId, true);

                successToast("Customer has been deleted successfully!");
                setDocumentId('');
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
    const handleDocumentClicked = async (document) => {
        const documentId = document.documentId
        await downloadDocument(documentId)
    }


    const fetchActiveDocuments = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllApprovedDocuments(formData);
            console.log("in active customer click", response?.data.content ?? [])
            setData(response?.data ?? []);
            console.log("data in response", data)

            setKeysToBeIncluded(["documentId", "documentType", "isApproved", "customerId", "agentId", "Edit"]);
            setShowApproveDocument(true);
            setShowNotApproveDocument(false);
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

    const fetchInActiveDocuments = async () => {
        try {
            const formData = {
                pageNo: 0,
                size: 10,
                sort: 'ASC',
            }
            const response = await getAllNotApprovedDocuments(formData);
            console.log("fetchInActiveDocuments ", response)
            setData(response?.data ?? []);
            console.log("fetchInActiveDocuments is in data", data)

            setKeysToBeIncluded(["documentId", "documentType", "isApproved", "customerId", "agentId", "Edit"]);
            setShowNotApproveDocument(true);
            setShowApproveDocument(false);
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
        if (showApproveDocument) {
            fetchActiveDocuments();
        }
        if (showNotApproveDocument) {
            fetchInActiveDocuments();
        }
        console.log("data in checking is", data)
    }, [currentPage, itemsPerPage]);


    useEffect(() => {
        resetPagination();
    }, []);

    useEffect(() => {
        resetPagination();
    }, [showApproveDocument, showNotApproveDocument]);

    return (
        <div className='content-area'>
            <AreaTop pageTitle={"All Documents"} pagePath={"all-documents"} pageLink={`/employee/dashboard/${routeParams.id}`} />
            <section className='content-area-form'>
                <div className="admin-form">
                    <div className="data-info">
                        <h3 className="data-table-title">Make Activate</h3>
                        <div className="buttons-container">
                            <button type="submit" className="form-submit" onClick={fetchActiveDocuments}>Get Approved Documents</button>
                            <button type="submit" className="form-submit" onClick={fetchInActiveDocuments}>Get Not Approved Documents</button>
                        </div>
                    </div>
                    <div className='activate-form'>
                        <form>
                            <input type="number" name="documentId" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required />
                            <button type="submit" className="form-submit-form" onClick={(event) => handleFormSubmit(event)}>Make Particular Document {showApproveDocument ? 'NotApproved' : 'Approved'}</button>
                        </form>
                    </div>


                    {newlyActivated && (
                        <div className="deactivate-success">
                            {activatedData}
                        </div>
                    )}

                </div>
            </section>

            {(showApproveDocument || showNotApproveDocument) && (
                <section className="content-area-table">
                    <div className="data-table-info">
                        <h3 className="data-table-title">{showApproveDocument ? 'Approved Documents' : 'Not Approved Documents'}</h3>
                    </div>
                    <div className="data-table-diagram">
                        <Table
                            data={data}
                            keysToBeIncluded={keysToBeIncluded}
                            includeButton={false}
                            handleButtonClick={null}
                            handleRowClicked={handleDocumentClicked}
                        />
                    </div>
                </section>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    )
}
