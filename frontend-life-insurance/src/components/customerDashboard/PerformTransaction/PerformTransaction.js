import React, { useEffect, useState } from 'react';
import { transactionById, initiateTransaction } from '../../../services/CustomerServices';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const PerformTransaction = () => {
    const routeParams = useParams()
    const navigate = useNavigate()
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [description, setDiscription] = useState('')
    const [intent, setIntent] = useState('ORDER')

    // Fetch transaction details from the backend
    useEffect(async () => {
        const handleGetTransaction = async () => {
            const response = await transactionById(routeParams.tid)
            setTransactionDetails(response)
            setIsLoading(false)
        }
        handleGetTransaction()
    }, []);

    const startTransaction = async () => {
        const formData = {
            price: transactionDetails.amount,
            description: description,
            intent: intent
        }
        const response = await initiateTransaction(formData, transactionDetails.transactionId)
        console.log("response in redirect is ", response)
        window.location.href = response
    };
    const handleDescription = (event) => {
        setDiscription(event.target.value);
    };
    const handleIntent = (event) => {
        console.log("event", event.target.value)
        setIntent(event.target.value);
    };

    if (isLoading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Transaction Details</h1>

            {transactionDetails ? (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-semibold">{transactionDetails.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">Rs. {transactionDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold">{transactionDetails.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{transactionDetails.transactionDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Policy Id:</span>
                        <span className="font-semibold">{transactionDetails.policyAccountId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">description</span>
                        <input
                            className="bg-gray-100 border border-gray-300 rounded-md"
                            type="text"
                            value={description}
                            onChange={handleDescription}
                        />
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Intent of payment</span>
                        <select
                            className="bg-gray-50 border border-gray-500 rounded-md"
                            value={intent}
                            onChange={handleIntent}
                        >
                            <option value="SALE">SALE</option>
                            <option value="AUTHORIZE">AUTHORIZE</option>
                            <option value="ORDER">ORDER</option>
                            <option value="NONE">NONE</option>
                        </select>
                    </div>
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        onClick={startTransaction}
                        hidden={transactionDetails.status === "Done"}
                    >
                        Start Transaction
                    </button>
                </div>
            ) : (
                <div>No transaction details available</div>
            )}
        </div>
    );
};

export default PerformTransaction;
