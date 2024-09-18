import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PurchasePolicy } from '../../../services/CustomerServices';
import { useLocation, useParams, useNavigate } from 'react-router-dom';



const PolicyPurchase = ({ policy }) => {
    const navigate = useNavigate()
    const { id } = useParams();  // Get the 'id' from the URL
    const location = useLocation();
    const [formData, setFormData] = useState({
        policyTerm: '',
        paymentTimeInMonths: '',
        nomineeName: '',
        nomineeRelation: '',
        investmentAmount: '',
        policyId: '',
        agentId: ''
    });
    const [isCreated,setIsCreated]=useState(false)
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        console.log(e.target.name)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        console.log(formData)
        if (formData.policyTerm < policy.minPolicyTerm || formData.policyTerm > policy.maxPolicyTerm ||
            formData.investmentAmount < policy.minInvestmentAmount || formData.investmentAmount > policy.maxInvestmentAmount) {
            setError("Please enter valid data")
            return
        }
        try {
            const updatedFormData = {
                ...formData,
                policyId: id, // Explicitly set the policyId
            };

            console.log("policyID", id)
            const response = await PurchasePolicy(updatedFormData);

            setSuccess("Policy data successfully submitted!");
            if (response.status == 200) {
                navigate(`/user/accounts/${response.data.policyAccountId}`)
            }
        } catch (error) {
            setError("Error submitting data. Please try again.");
        }
    };
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const agentId = searchParams.get('agentId'); // Extract agentId from the URL
        if (agentId) {
            setFormData((prevData) => ({
                ...prevData,
                agentId,
            }));
        }
    }, [location.search]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Buy Policy</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Policy Term */}
                    <div>
                        <label className="block text-gray-700">Number of years</label>
                        <input
                            type="number"
                            name="policyTerm"
                            value={formData.policyTerm}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    {/* Payment Time in Months */}
                    <div>
                        <label className="block text-gray-700">Payment Time (Months)</label>
                        <select
                            name="paymentTimeInMonths"
                            value={formData.paymentTimeInMonths}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                        >
                            <option value="">Select Months</option>
                            <option value="1">1 Month</option>
                            <option value="4">4 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">12 Months</option>
                            <option value="24">24 Months</option>
                        </select>
                    </div>


                    {/* Investment Amount */}
                    <div>
                        <label className="block text-gray-700">Investment Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            name="investmentAmount"
                            value={formData.investmentAmount}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Nominee Name</label>
                        <input
                            type="text"
                            name="nomineeName"
                            value={formData.nomineeName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Nominee Relation</label>
                        <select
                            name="nomineeRelation"
                            value={formData.nomineeRelation}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                        >
                            <option value="">Select Relation</option>
                            <option value="BROTHER">BROTHER</option>
                            <option value="SISTER">SISTER</option>
                            <option value="MOTHER">MOTHER</option>
                            <option value="FATHER">FATHER</option>
                            <option value="DAUGHTER">DAUGHTER</option>
                            <option value="SON">SON</option>
                        </select>
                    </div>

                    {/* Error/Success Messages */}
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PolicyPurchase;
