import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllPolicies } from '../../services/PublicService';
import { useNavigate } from 'react-router-dom';

const PoliciesPage = () => {
    const [policies, setPolicies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Adjusted to start from 0 based on backend structure
    const [totalPages, setTotalPages] = useState(1);
    const [lastPage, setLastPage] = useState(false); // To track if the current page is the last
    const navigate = useNavigate()
    useEffect(() => {
        // Fetch policies on component mount and whenever currentPage changes
        const fetchPolicies = async (page) => {
            try {
                const formData = {
                    page: 0,
                    size: 5
                }
                const response = await getAllPolicies(formData);
                const { content, page: current, totalPages, last } = response.data; // Destructure PagedResponse

                setPolicies(content);
                setCurrentPage(current);
                setTotalPages(totalPages);
                setLastPage(last);
            } catch (error) {
                console.error('Error fetching policies:', error);
            }
        };

        fetchPolicies(currentPage);
    }, [currentPage]);

    // Handles pagination click
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handlePolicyClicked = (policy) => {
        navigate(`/policy/${policy.policyId}`)
    }
    if (policies.length == 0) return <div>Loading...</div>; // Show loading state while fetching

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Policies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {policies.map((policy) => (
                    <div onClick={() => handlePolicyClicked(policy)}>
                        <div
                            key={policy.policyId}
                            className="bg-white shadow-md rounded-md p-4 flex flex-col items-center"
                        >
                            {/* Adjusting image styles to be centered */}
                            <img
                                src={`data:image/png;base64,${policy?.imageUrl}`}
                                alt="Policy Image"
                                className="mb-4 max-w-full h-auto"
                            />
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">{policy.policyName}</h2>
                                <p className="text-gray-600">{policy.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${currentPage === 0 ? 'opacity-50' : ''}`}
                >
                    Previous
                </button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={lastPage}
                    className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${lastPage ? 'opacity-50' : ''}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PoliciesPage;
