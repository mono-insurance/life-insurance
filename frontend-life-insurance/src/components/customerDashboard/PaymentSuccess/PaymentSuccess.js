import React, { useEffect, useState } from 'react';
import {
   MdOutlineCheckCircle,
} from 'react-icons/md';
import { verifyPaymentIntent } from '../../../services/CustomerServices';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const verifyPayment = async (sessionId) => {
        try {
          setLoading(true);
          console.log(sessionId);
          await verifyPaymentIntent(sessionId);

          const newUrl = window.location.origin + window.location.pathname;
          window.history.replaceState(null, '', newUrl);

        } catch (error) {
            if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
            } else {
              errorToast("An unexpected error occurred. Please try again later.");
            }
          }finally{
            setLoading(false);
          }
      };
    
      useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('session_id');
    
        if (sessionId) {
          verifyPayment(sessionId);
        }
      }, []);


  return (
    <div className="flex flex-col gap-10 items-center justify-center p-8"> 
    {loading && <Loader />}
        <div className="border border-gray-400 rounded-lg p-8 py-7 bg-gray-100 sm:mx-0 mt-[-10px] sm:mt-0 shadow-lg flex flex-col items-center">
            <p className="flex items-center gap-2 text-gray-500 text-5xl font-medium text-gray-900 uppercase">
            Payment Successful
            </p>
            <div className="text-lg mt-1 text-gray-600 text-center">
            <p>Thank you for your payment! Your transaction has been successfully completed.</p>
            </div>
            {/* Centered Check Circle Icon */}
            <div className="flex justify-center mt-4">
            <MdOutlineCheckCircle className="text-9xl text-green-500" />
            </div>
        </div>

        <div className="flex justify-center">
            <button onClick={()=>navigate('/suraksha/customer/policy-account')}className="bg-indigo-500 text-white py-2 px-6 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
                Go to Purchased Policies
            </button>
        </div>
        <ToastContainer position="bottom-right" />
    </div>

  );
};
