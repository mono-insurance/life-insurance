import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestWithdrawal, getAgentBalance } from '../../../services/AgentService';

const AgentBalance = () => {
    const [balance, setBalance] = useState(0);
    const [totalwithdrawal, setTotalwithdrawals] = useState(0);   // Total withdrawals
    const [withdrawalAmount, setWithdrawalAmount] = useState(''); // Withdrawal amount
    const [message, setMessage] = useState('');                   // To display messages

    // Fetching current balance (real API call)
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // Log before fetching to debug
                console.log('Fetching agent balance...');

                const response = await getAgentBalance();

                // Ensure response is structured correctly
                console.log('Response from getAgentBalance:', response);

                setBalance(response.currentBalance || 0);
                setTotalwithdrawals(response.withdrawalAmount || 0);
            } catch (error) {
                console.error('Error fetching balance:', error);
                setMessage('Failed to fetch balance');
            }
        };

        fetchBalance();
    }, []);  // Empty dependency array means this runs only once

    const handleWithdraw = async () => {
        if (!withdrawalAmount || withdrawalAmount < 0 || withdrawalAmount > balance) {
            setMessage('Please enter a valid amount');
            return;
        }

        try {
            console.log('Sending withdrawal request for amount:', withdrawalAmount);
            const response = await requestWithdrawal(withdrawalAmount);

            // Log response to debug
            console.log('Response from requestWithdrawal:', response);

            setMessage(response.data.message || 'Withdrawal request sent');
        } catch (error) {
            console.error('Error sending withdrawal request:', error);
            setMessage('Failed to send withdrawal request');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Withdrawal</h2>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Current Balance</p>
                    <p className="text-3xl font-bold text-green-500">Rs. {balance}</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Total Withdrawals</p>
                    <p className="text-3xl font-bold text-green-500">Rs. {totalwithdrawal}</p>
                </div>

                <div className="space-y-4">
                    <label className="block text-gray-600">Withdrawal Amount</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        placeholder="Enter amount"
                    />
                </div>

                <button
                    className="w-full px-4 py-2 mt-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={handleWithdraw}
                >
                    Request Withdrawal
                </button>

                {message && (
                    <div className="mt-4 text-center text-red-500">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentBalance;
