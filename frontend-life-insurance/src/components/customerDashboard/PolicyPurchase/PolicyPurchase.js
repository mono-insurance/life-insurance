import React, { useState, useEffect } from 'react';
import { PurchasePolicy } from '../../../services/CustomerServices';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const PolicyPurchase = ({ policy }) => {
    const navigate = useNavigate();
    const { id } = useParams();
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
    const [isCreated, setIsCreated] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [interestAmount, setInterestAmount] = useState(0);
    const [installmentAmount, setInstallmentAmount] = useState(0);
    const queryParams = new URLSearchParams(location.search);
    const [agentId, setAgentId] = useState(queryParams.get('agentId'))


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const calculateAmounts = () => {
        // Assuming the formula for calculation is provided
        const investmentAmount = parseFloat(formData.investmentAmount);
        const policyTerm = parseInt(formData.policyTerm);
        const profitRatio = policy.profitRatio;

        // Example calculations
        const interestAmount = (investmentAmount * profitRatio * policyTerm) / 100;
        const totalAmount = investmentAmount + interestAmount;
        const transactionMonths = (parseInt(formData.policyTerm) * 12) / parseInt(formData.paymentTimeInMonths);
        const installmentAmount = (parseInt(formData.investmentAmount)) / parseInt(transactionMonths);

        setTotalAmount(totalAmount);
        setInterestAmount(interestAmount);
        setInstallmentAmount(installmentAmount);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        console.log("agent id is ", queryParams.get('agentId'))
        if (agentId) {
            setFormData((prevData) => ({
                ...prevData,
                agentId,
            }));
        }
        console.log("formdata before purchase policy", formData)

        if (formData.policyTerm < policy.minPolicyTerm || formData.policyTerm > policy.maxPolicyTerm ||
            formData.investmentAmount < policy.minInvestmentAmount || formData.investmentAmount > policy.maxInvestmentAmount) {
            setError("Please enter valid data");
            return;
        }

        if (showConfirmation) {
            try {
                const updatedFormData = {
                    ...formData,
                    policyId: id,
                };
                console.log("updated formdata before purchase policy", updatedFormData)

                const response = await PurchasePolicy(updatedFormData);


                if (response) {
                    navigate(`/customer/policy-account/${localStorage.getItem("id")}/view/${response.data.policyAccountId}`);
                    setSuccess("Policy data successfully submitted!");
                }
                else setError(response.data.message);

            } catch (error) {
                setError("Error submitting data. Please try again.");
            }
        } else {
            calculateAmounts();
            setShowConfirmation(true);
        }
    };
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

                    {/* Calculation Summary */}
                    {showConfirmation && (
                        <div className="p-4 border border-gray-300 rounded-md mb-4">
                            <h3 className="text-lg font-bold">Summary</h3>
                            <p>Total Amount: Rs.{totalAmount.toFixed(2)}</p>
                            <p>Interest Amount: Rs.{interestAmount.toFixed(2)}</p>
                            <p>Installment Amount: Rs.{installmentAmount.toFixed(2)}</p>
                            <div className="mt-4">  {/* Add a div with a margin-top */}
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
                                >
                                    Confirm Purchase
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {!showConfirmation && (
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
                            >
                                Proceed to Summary
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PolicyPurchase;
