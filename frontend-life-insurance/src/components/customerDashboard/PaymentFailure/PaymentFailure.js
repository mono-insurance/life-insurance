import React from 'react';
import {
  MdOutlineCancel,
} from 'react-icons/md';

export const PaymentFailure = () => {

  const handleRetry = () => {
    window.history.go(-1);
  };


  return (
    <div className="flex flex-col gap-10 items-center justify-center p-8"> 
      <div className="border border-gray-400 rounded-lg p-8 py-7 bg-gray-100 sm:mx-0 mt-[-10px] sm:mt-0 shadow-lg flex flex-col items-center">
        <p className="flex items-center gap-2 text-red-500 text-5xl font-medium uppercase">
          Payment Failed
        </p>
        <div className="text-lg mt-1 text-gray-600 text-center">
          <p>We encountered an issue processing your payment. Please try again.</p>
        </div>
        <div className="flex justify-center mt-4">
          <MdOutlineCancel className="text-9xl text-red-500" />
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={handleRetry} className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
          Retry Payment
        </button>
      </div>
    </div>
  );
};
