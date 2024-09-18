import React, { useEffect, useState } from 'react';
import { SinglePolicy, IsEligible } from '../../services/PublicService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PolicyPurchase from '../customerDashboard/PolicyPurchase/PolicyPurchase';

const PoliciesPage = () => {
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [isEligible, setIsEligible] = useState(false);
    const { id } = useParams();

    const handleBuyPolicy = async (policyId) => {
        const token = localStorage.getItem('auth');
        if (!token) navigate('/login');
        const response = await IsEligible(policyId);
        setIsEligible(response.data);
    };

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await SinglePolicy(id);
                setPolicy(response.data);
            } catch (error) {
                console.error('Error fetching policy:', error);
            }
        };

        fetchPolicy();
    }, [id]);

    if (!policy) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6 md:p-8 lg:p-12">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Policy Details</h1>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                    src={`data:image/png;base64,${policy.imageUrl}`}
                    alt="Policy Image"
                    className="w-95 h-90 mx-auto block"
                />
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">{policy.policyName}</h2>
                    <p className="text-gray-700 mb-4">{policy.description}</p>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Policy Terms</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p><strong>Minimum Investment Term:</strong> {policy.minPolicyTerm} years</p>
                            </div>
                            <div>
                                <p><strong>Maximum Investment Term:</strong>  {policy.maxPolicyTerm} years</p>
                            </div>
                            <div>
                                <p><strong>Maximum Age:</strong> {policy.minAge} years</p>
                            </div>
                            <div>
                                <p><strong>Minimum Age:</strong> {policy.maxAge} years</p>
                            </div>
                            <div>
                                <p><strong>Eligible Gender:</strong> {policy.eligibleGender}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Investment & Profit</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p><strong>Minimum Investment Amount :</strong> Rs.{policy.minInvestmentAmount} </p>
                            </div>
                            <div>
                                <p><strong>Maximum Investment Amount :</strong> Rs.{policy.maxInvestmentAmount}</p>
                            </div>
                            <div>
                                <p><strong>Profit Ratio:</strong> {policy.profitRatio}%</p>
                            </div>
                        </div>
                    </div>

                    {policy.documentsNeeded && policy.documentsNeeded.length > 0 && (
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Documents Needed</h3>
                            <ul className="list-disc list-inside text-gray-700">
                                {policy.documentsNeeded.map(doc => (
                                    <li key={doc.documentId}>{doc.documentType}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {!isEligible ? (
                <div className="text-center mt-8">
                    <button
                        onClick={() => handleBuyPolicy(policy.policyId)}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                        Buy Policy
                    </button>
                </div>
            ) : (
                <div className="mt-8">
                    <PolicyPurchase policy={policy} />
                </div>
            )}
        </div>
    );
};

export default PoliciesPage;
