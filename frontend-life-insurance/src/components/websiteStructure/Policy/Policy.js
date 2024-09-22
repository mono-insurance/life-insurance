import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { getPolicyById } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import {
  MdOutlineInfo,
  MdOutlineVerified,
} from 'react-icons/md';
import { InterestCalculator } from '../../../sharedComponents/Calculator/Calculator';
import { RelatedPolicy } from './RelatedPolicy';
import { validateCustomer } from '../../../services/AuthServices';
import { calculateAge } from '../../../utils/helper/helperFunctions';
import { ToastContainer } from 'react-toastify';
import { generatePayment, getCustomerApprovedDocuments } from '../../../services/CustomerServices';
import { validateCalculationsFields } from '../../../utils/validations/Validations';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Policy = () => {
  const { policyId } = useParams();
  const [data, setData] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEligible, setIsEligible] = useState(true);
  const [buttonPosition, setButtonPosition] = useState({});
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { customerId } = useOutletContext();
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [profitAmount, setProfitAmount] = useState(0);
  const [totalMaturityAmount, setTotalMaturityAmount] = useState(0);
  const [showCalculations, setShowCalculations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    policyTerm: '',
    totalInvestmentAmount: '',
    installmentTimePeriod: '1',
    nomineeName: '',
    nomineeRelation: 'BROTHER'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const checkEligibility = async (customerResponse, response) => {
    try {
      console.log(customerResponse);
      const { dateOfBirth , gender } = customerResponse;
      const age = calculateAge(dateOfBirth);

      const isGenderEligible = response.eligibleGender.toLowerCase() === 'both' || gender.toLowerCase() === response.eligibleGender.toLowerCase();

      if (
        (response.minAge && age > response.minAge) && (response.maxAge && age < response.maxAge) && isGenderEligible
      ) {
        console.log('Eligible');
        setIsEligible(true);
      }
      else{
        console.log('Not Eligible');
        setIsEligible(false);
      }

    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.specificMessage ||
        'which An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }
  };

  const checkDocumentEligibility = async () => {
    try {
      setLoading(true);
      if (data.documentsNeeded) {
        
        const documentsNeeded = data.documentsNeeded.map((doc) => doc.toLowerCase());
        const customerDocuments = await getCustomerApprovedDocuments(customerId);
        const normalizedCustomerDocuments = customerDocuments.map((doc) => doc.documentType.toLowerCase());
        const isEligible = documentsNeeded.every((doc) => normalizedCustomerDocuments.includes(doc));
  
        // Log the results for debugging
        console.log('Documents Needed:', documentsNeeded);
        console.log('Customer Approved Documents:', normalizedCustomerDocuments);
        console.log('Eligibility:', isEligible);
  
        if (!isEligible) {
          errorToast('You are not eligible for this policy. Please upload the required documents. And After Thier Approval You can Purchase this Scheme');
          return false;
        }
        else{
          return true;
        }
        
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.specificMessage ||
        'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }finally{
      setLoading(false);
    }
  };
  

  const handlePurchaseClick = async () => {
    if (!isAuthenticated) {
      const queryParams = window.location.search;
      const currentPath = window.location.pathname;
      navigate('/suraksha/login', { state: { from: `${currentPath}${queryParams}` } });
    } else {
      // Await the result of the async function
      const isEligible = await checkDocumentEligibility();
  
      if (isEligible) {
        console.log('Eligible documents');
        setShowPurchaseForm(true);
      } else {
        console.log('Not Eligible documents');
        setShowPurchaseForm(false);
      }
    }
  };

  const policyTable = async () => {
    try {
      setLoading(true);
      const response = await getPolicyById(policyId);
      setData(response);
      console.log(response);

      const customerResponse = await validateCustomer();
      if (customerResponse) {
        setIsAuthenticated(true);
        checkEligibility(customerResponse, response);
      }

    } catch (error) {
      setData({});
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowPurchaseForm(false);
    setIsAuthenticated(false);
    setIsEligible(true);
    policyTable();
  }, [policyId]);


  const handleCalculateClick = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    setButtonPosition({
      top: rect.top,
      left: rect.left,
      width: rect.width,
    });
    setShowCalculator(true);
  };

  const handleFormCancel = () => {
    setShowCalculations(false);
    setInstallmentAmount(0);
    setProfitAmount(0);
    setTotalMaturityAmount(0);
  };

  const handleFormSubmit = (e) => {
      e.preventDefault();
  
      const { policyTerm, totalInvestmentAmount, installmentTimePeriod } = formValues;
  
      const validationErrors = validateCalculationsFields(
          policyTerm, 
          totalInvestmentAmount, 
          parseInt(installmentTimePeriod), 
          data.minPolicyTerm, 
          data.maxPolicyTerm, 
          data.minInvestmentAmount, 
          data.maxInvestmentAmount
      );

      if(formValues.nomineeName === '' || formValues.nomineeRelation === ''){
        errorToast('Nominee Name and Nominee Relationship are required');
        return;
      }
  
      if (Object.keys(validationErrors).length === 0) {
          const totalMonths = parseInt(policyTerm) * 12; 
          const noOfPayments = totalMonths / parseInt(installmentTimePeriod); 
          const installment = parseFloat(totalInvestmentAmount / noOfPayments);
          const profit = parseFloat((totalInvestmentAmount * data.profitRatio) / 100);
          const totalMaturity = parseFloat(totalInvestmentAmount) + parseFloat(profit);
  
          setInstallmentAmount(installment.toFixed(2));
          setProfitAmount(profit.toFixed(2));
          setTotalMaturityAmount(totalMaturity.toFixed(2));
          setShowCalculations(true);
      } else {
          setInstallmentAmount(0);
          setProfitAmount(0);
          setTotalMaturityAmount(0);
          setShowCalculations(false);
          Object.keys(validationErrors).forEach((key) => {
              errorToast(validationErrors[key]);
          });
      }
  };

  const handlePayment = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const agentId = queryParams.get('agentId');

    const requestData = {
      policyTerm: formValues.policyTerm,
      paymentTimeInMonths: formValues.installmentTimePeriod,
      investmentAmount: formValues.totalInvestmentAmount,
      amount: installmentAmount,
      nomineeName: formValues.nomineeName,
      nomineeRelation: formValues.nomineeRelation,
      policyId: policyId,
      customerId: customerId,
      successUrl: `${window.location.origin}/suraksha/payment-success`,
      failureUrl: `${window.location.origin}/suraksha/payment-failure`,
    };

    if (agentId) {
      requestData.agentId = agentId;
    }

    try{
      console.log(requestData);
      await generatePayment(requestData);
      
    }catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }
  }

  const handleFormSubmitPayment = (e) => {
    e.preventDefault();
    const validationErrors = validateCalculationsFields(
      formValues.policyTerm, 
      formValues.totalInvestmentAmount, 
      parseInt(formValues.installmentTimePeriod), 
      data.minPolicyTerm, 
      data.maxPolicyTerm, 
      data.minInvestmentAmount, 
      data.maxInvestmentAmount
  );
  if(formValues.nomineeName === '' || formValues.nomineeRelation === ''){
    errorToast('Nominee Name and Nominee Relationship are required');
    return;
  }
  if (Object.keys(validationErrors).length === 0) {

    handlePayment();
  }
  else {
      setInstallmentAmount(0);
      setProfitAmount(0);
      setTotalMaturityAmount(0);
      setShowCalculations(false);
      Object.keys(validationErrors).forEach((key) => {
          errorToast(validationErrors[key]);
      });
    }

  }

  return (
    data && (
      <div>
        {loading && <Loader />}
        <div className="gap-10">
          <div className="mb-4">
            {data.imageBase64 && (<img
              className="border border-gray-400 bg-primary margin-bottom:10px w-full sm:max-w-100 max-h-60 sm:max-h-75 rounded-lg object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
              src={`data:image/jpeg;base64,${data.imageBase64}`}
              alt={data.policyName}
            />)}
          </div>
          <div className="border border-gray-400 rounded-lg p-8 py-7 bg-white sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-5xl font-medium text-gray-900 uppercase">
              {data.policyName}
              <MdOutlineVerified size={30} className="text-indigo-500" />
            </p>
            <div className="flex items-center gap-2 text-lg mt-1 ml-2 text-gray-600">
              <p>
                SCH{data.policyId} | {data.createdDate}
              </p>
            </div>
            <div className="ml-2">
              <p className="flex items-center text-2xl font-medium mt-3 text-gray-900 gap-2">
                Description <MdOutlineInfo size={18} />
              </p>
              <p className="text-xl text-gray-800 max-w-[700px] ">{data.description}</p>
            </div>

            <div className="mt-5 ml-2">
              <div className="text-gray-700 text-lg mt-2">
                <p>
                  <strong>Eligible Gender:</strong> {data.eligibleGender}
                </p>
                <p>
                  <strong>Min Age:</strong> {data.minAge}
                </p>
                <p>
                  <strong>Max Age:</strong> {data.maxAge}
                </p>
                <p>
                  <strong>Min Investment Amount:</strong> {data.minInvestmentAmount}
                </p>
                <p>
                  <strong>Max Investment Amount:</strong> {data.maxInvestmentAmount}
                </p>
                <p>
                  <strong>Min Policy Term:</strong> {data.minPolicyTerm} years
                </p>
                <p>
                  <strong>Max Policy Term:</strong> {data.maxPolicyTerm} years
                </p>
                <p>
                  <strong>Profit Ratio:</strong> {data.profitRatio}%
                </p>
                <p>
                  <strong>Documents Needed:</strong>{' '}
                  {Array.isArray(data.documentsNeeded)
                    ? data.documentsNeeded.join(', ').replace(/_/g, ' ')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {showPurchaseForm && isEligible ? (
            <form className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col w-full">
                <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700 text-lg mt-2">
                            <strong>Policy Term </strong><span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            name="policyTerm"
                            placeholder="Policy Term"
                            value={formValues.policyTerm}
                            onChange={handleFormChange}
                            className="border border-gray-600 p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700 text-lg mt-2">
                            <strong>Total Investment Amount </strong><span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            name="totalInvestmentAmount"
                            placeholder="Total Investment Amount"
                            value={formValues.totalInvestmentAmount}
                            onChange={handleFormChange}
                            className="border border-gray-600 p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700 text-lg mt-2">
                            <strong>Installment Period </strong><span className="text-red-600">*</span>
                        </label>
                        <select
                            className="border border-gray-600 p-2 rounded w-full"
                            name="installmentTimePeriod"
                            value={formValues.installmentTimePeriod}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="1">1 months </option>
                            <option value="3">3 months </option>
                            <option value="6">6 months </option>
                            <option value="12">12 months </option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700 text-lg mt-2">
                            <strong>Nominee Name </strong><span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="nomineeName"
                            placeholder="Nominee Name"
                            value={formValues.nomineeName}
                            onChange={handleFormChange}
                            className="border border-gray-600 p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-gray-700 text-lg mt-2">
                            <strong>Nominee Relationship </strong><span className="text-red-600">*</span>
                        </label>
                        <select
                            className="border border-gray-600 p-2 rounded w-full"
                            name="nomineeRelation"
                            value={formValues.nomineeRelation}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="BROTHER">Brother</option>
                            <option value="SISTER">Sister</option>
                            <option value="MOTHER">Mother</option>
                            <option value="FATHER">Father</option>
                            <option value="SON">Son</option>
                            <option value="DAUGHTER">Daughter</option>
                            <option value="SPOUSE">Spouse</option>
                        </select>
                    </div>
                </div>
            </div>

            {showCalculations && (
                <div className="flex flex-col w-full mt-4">
                    <p className="text-lg">
                        Installment Amount: <strong>{installmentAmount}</strong>
                    </p>
                    <p className="text-lg">
                        Profit Amount: <strong>{profitAmount}</strong>
                    </p>
                    <p className="text-lg">
                        Total Amount after Maturity: <strong>{totalMaturityAmount}</strong>
                    </p>
                </div>
            )}
            
        
            <div className="flex justify-center">
              {!showCalculations ? (
                <button
                    onClick={handleFormSubmit}
                    type="button"
                    className="bg-indigo-500 text-white text-lg font-light px-14 py-3 rounded-full my-6"
                >
                    Proceed to Purchase
                </button>):(
                  <div>
                    <button
                      onClick={handleFormCancel}
                      type="button"
                      className="bg-indigo-500 text-white text-lg font-light px-14 py-3 rounded-full my-6 mr-4"
                    >
                        Cancel
                    </button>
                    <button
                      onClick={handleFormSubmitPayment}
                      type="button"
                      className="bg-indigo-500 text-white text-lg font-light px-14 py-3 rounded-full my-6"
                    >
                    Pay Now
                    </button>
                  </div>
                )}

            </div>
        </form>
              
          ) : !isEligible ? (
              <div className='flex justify-center bg-gray-500 text-white text-lg font-light px-14 py-3 rounded-full my-6'>
                You are not eligible for this policy.
              </div>
            ) : (
              <div className="flex justify-center">
                <button onClick={handlePurchaseClick} className='bg-indigo-500 text-white text-lg font-light px-14 py-3 rounded-full my-6'>
                  Purchase Scheme
                </button>
              </div>
          )}

          { data.insuranceTypeId && (
              <RelatedPolicy policyId={policyId} insuranceTypeId={data.insuranceTypeId} />
          )}
          <button
            ref={buttonRef}
            onClick={handleCalculateClick}
            className="fixed bottom-10 right-10 bg-indigo-500 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
            Interest Calculator
        </button>

        {/* Display Interest Calculator above the button */}
        {showCalculator && (
            <InterestCalculator
            onClose={() => setShowCalculator(false)}
            buttonPosition={buttonPosition}
            />
        )}
        </div>
        <ToastContainer position="bottom-right"/>
      </div>
      
    )
  );
};
