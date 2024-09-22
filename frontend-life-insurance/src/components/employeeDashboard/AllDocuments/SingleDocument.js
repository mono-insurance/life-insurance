import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SingleDocument = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch document from API
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get('/api/document/1'); // Replace with your API endpoint
                setDocument(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch document');
                setLoading(false);
            }
        };

        fetchDocument();
    }, []);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {document ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">{document.title}</h1>
                    <p className="text-gray-700 mb-4">{document.content}</p>
                    <span className="text-sm text-gray-500">Author: {document.author}</span>
                </div>
            ) : (
                <div className="text-center">No document found</div>
            )}
        </div>
    );
};

export default SingleDocument;
