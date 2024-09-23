import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getDocumentById } from '../../../services/AgentService';
import { useParams } from 'react-router-dom';
import { approveDocument } from '../../../services/EmployeeServices';
import { successToast } from '../../../utils/helper/toast';
const SingleDocument = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { documentId } = useParams();
    // Fetch document from API
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await getDocumentById(documentId); // Replace with your API endpoint
                setDocument(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch document');
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-lg text-gray-500 animate-pulse">Loading...</div>
        </div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-lg text-red-500">{error}</div>
        </div>;
    }

    const handleApproval = async (e, check) => {
        e.preventDefault()
        console.log("in handleDeleteCustomer")
        console.log("documentId id s", documentId)
        await approveDocument(documentId, check)
        successToast("request accepted")
    }

    return (
        <div className="max-w-3xl mx-auto p-8">
            {document ? (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="relative">
                        <img
                            className="w-full h-64 object-cover"
                            src={`data:image/jpeg;base64,${document.imageBase64}`}
                            alt="Document"
                        />
                        {document.isApproved && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                                Approved
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {document.documentType}
                        </h1>
                        <p className="text-gray-500 text-sm mb-4">
                            Document ID: {documentId}
                        </p>
                        {document.customerName ? (
                            <div className="text-gray-500 text-sm mb-4">
                                Customer Name: {document.customerName}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm mb-4">
                                Agent Name: {document.agentName}
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-4">
                            <span
                                className={`text-sm font-medium px-4 py-1 rounded-full ${document.isApproved ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}
                            >
                                {document.isApproved ? 'Approved' : 'Pending Approval'}
                                {!document.isApproved && (
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                                            onClick={(e) => handleApproval(e, true)}
                                        >
                                            Verify
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                                            onClick={(e) => handleApproval(e, false)}
                                        >
                                            Not Verify
                                        </button>
                                    </div>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">No document found</div>
            )}
        </div>
    );
};

export default SingleDocument;
