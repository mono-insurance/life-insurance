import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestWithdrawal, getAgentBalance } from '../../../services/AgentService';

const AgentBalance = () => {
    const [balance, setBalance] = useState(0);
    const [totalwithdrawal, setTotalwithdrawals] = useState(0)   // Current balance
    const [withdrawalAmount, setWithdrawalAmount] = useState(''); // Withdrawal amount
    const [message, setMessage] = useState('');   // To display messages

    // Mock fetching current balance (could be replaced with a real API call)
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                // Replace with real API call
                const response = await getAgentBalance()
                setBalance(response.currentBalance);
                setTotalwithdrawals(response.withdrawalAmount)
            } catch (error) {
                setMessage('Failed to fetch balance');
            }
        };

        fetchBalance();
    }, []);

    const handleWithdraw = async () => {
        if (!withdrawalAmount || withdrawalAmount < 0 || withdrawalAmount > balance) {
            setMessage('Please enter a valid amount');
            return;
        }

        try {
            const response = await requestWithdrawal(withdrawalAmount)

            setMessage(response.data.message || 'Withdrawal request sent');
        } catch (error) {
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
                    <p className="text-lg font-semibold text-gray-600">total withdrawals</p>
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
