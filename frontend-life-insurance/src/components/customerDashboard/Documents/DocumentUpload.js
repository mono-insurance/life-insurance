import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DocumentOptions } from '../../../services/PublicService';
import { UploadDocument } from '../../../services/CustomerServices';

const DocumentUpload = () => {
    const [selectedDocument, setSelectedDocument] = useState('');
    const [file, setFile] = useState(null);

    const [alldocumentNames, setAllDocumentNames] = useState([])

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    useEffect(() => {
        const documentNames = async () => {
            const response = await DocumentOptions();
            setAllDocumentNames(response.data.content)
        }
        documentNames()
        console.log("Updated documentNames:", alldocumentNames);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDocument || !file) {
            alert('Please select a document type and upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('documentType', selectedDocument);
        formData.append('file', file);
        formData.append('customerId', 18)

        try {
            const response = await UploadDocument(formData);

            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Upload Document</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dropdown for document type */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Select Document Type</label>
                        <select
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                        >
                            <option value="">-- Select Document --</option>
                            {alldocumentNames.map((doc, index) => (
                                <option key={index} value={doc.documentType}>
                                    {doc.documentType.replaceAll('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* File upload */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Upload Document</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                        />
                    </div>

                    {/* Submit button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentUpload;
