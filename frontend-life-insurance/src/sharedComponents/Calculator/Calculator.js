import React, { useState, useRef, useEffect } from 'react';
import { validateCalculatorFields } from '../../utils/validations/Validations';
import { errorToast } from '../../utils/helper/toast';

export const InterestCalculator = ({ onClose, buttonPosition }) => {
  const [totalInvestment, setTotalInvestment] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('12');
  const [installmentAmount, setInstallmentAmount] = useState(null);
  const [interestAmount, setInterestAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  const modalRef = useRef(null);

  const calculateAmounts = () => {
    const errors = validateCalculatorFields(years, totalInvestment, parseInt(months), rate);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((errorMessage) => {
        errorToast(errorMessage);
      });
      return;
    }

    const totalMonths = parseInt(years) * 12;
    const noOfPayments = totalMonths / parseInt(months);
    const monthlyInstallment = parseFloat(parseInt(totalInvestment) / noOfPayments);
    const interest = parseFloat(totalInvestment * rate) / 100;
    const total = parseFloat(totalInvestment) + interest;

    setInstallmentAmount(monthlyInstallment);
    setInterestAmount(interest);
    setTotalAmount(total);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed left-0 right-0 mx-auto bg-opacity-50 flex justify-center items-center z-50"
      ref={modalRef}
      style={{
        top: installmentAmount !== null ? buttonPosition.top - 470 : buttonPosition.top - 370,
        left: buttonPosition.left - 400,
        width: 'auto',
      }}
    >
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Interest Calculator</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Total Investment Amount
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={totalInvestment}
              onChange={(e) => setTotalInvestment(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Profit Rate (%)
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">Years</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>

          <div className="mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Installment Frequency (Months)
            </label>
            <select
              className="w-full p-2 border rounded"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            >
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateAmounts}
          className="bg-indigo-500 text-white py-2 px-4 rounded w-full mb-4"
        >
          Calculate
        </button>

        {installmentAmount !== null && (
          <div className="mt-4">
            <p className="text-lg">
              Installment Amount: <strong>{installmentAmount.toFixed(2)}</strong>
            </p>
            <p className="text-lg">
              Profit Amount: <strong>{interestAmount.toFixed(2)}</strong>
            </p>
            <p className="text-lg">
              Total Amount: <strong>{totalAmount.toFixed(2)}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
