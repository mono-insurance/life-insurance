import React from 'react';

const FailedTransaction = () => {
    return (
        <div className="container mx-auto py-16">
            <h1 className="text-3xl font-bold text-red-500">Transaction Failed</h1>
            <p className="text-lg text-gray-700">
                We apologize for the inconvenience. There was an error processing your
                transaction. Please try again later or contact our support team for
                assistance.
            </p>
        </div>
    );
};

export default FailedTransaction;