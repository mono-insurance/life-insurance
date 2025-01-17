import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { useOutletContext, useParams } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { fetchingTransactionsByPolicyAccountId, generateInstallmentPayment, generatePaymentReceipt, getPolicyAccountById, getWithdrawalRequestsByPolicyAccountId, requestForWithdrawalByCustomer } from '../../../services/CustomerServices';
import './viewPolicyAccount.scss';
import { Table } from '../../../sharedComponents/Table/Table';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const ViewEmpPolicyAccount = () => {
  const { policyAccountId: policyAccountId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const { id: id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    policyAccountId: '',
    createdDate: '',
    maturedDate: '',
    policyTerm: '',
    investmentAmount: '',
    nomineeName: '',
    nomineeRelation: '',
    policyId: '',
    totalAmountPaid: '',
    claimAmount: '',
    isActive: true,
    paymentTimeInMonths: ''
  });


  useEffect(() => {
    const fetchPolicyAccountDetails = async () => {
      try {
        setLoading(true);

        const accountResponse = await getPolicyAccountById(policyAccountId);
        console.log(accountResponse);

        setFormState({
          policyAccountId: accountResponse.policyAccountId || '',
          createdDate: accountResponse.createdDate || '',
          maturedDate: accountResponse.maturedDate || '',
          policyTerm: accountResponse.policyTerm || '',
          investmentAmount: accountResponse.investmentAmount || '',
          nomineeName: accountResponse.nomineeName || '',
          nomineeRelation: accountResponse.nomineeRelation || '',
          policyId: accountResponse.policyId || '',
          totalAmountPaid: accountResponse.totalAmountPaid || 0,
          claimAmount: accountResponse.claimAmount || '',
          isActive: accountResponse.isActive,
          paymentTimeInMonths: accountResponse.paymentTimeInMonths || ''
        });

        if (!id) return;

        const transactionsResponse = await fetchingTransactionsByPolicyAccountId(policyAccountId, currentPage, itemsPerPage);
        const today = new Date();
        const processedData = transactionsResponse.content.map((transaction) => {
          const transactionDate = new Date(transaction.transactionDate);

          // Pay column logic
          let payColumnContent;
          if (transaction.status.toLowerCase() === 'pending' && transactionDate <= today) {
            payColumnContent = (<button className="bg-gray-400 text-white py-1 px-2 rounded-md hover:bg-indigo-500" >Not Paid</button>);
          } else if (transaction.status.toLowerCase() === 'done') {
            payColumnContent = (<p className="text-green-500 font-semibold">Paid</p>);
          }

          // Receipt column logic
          let receiptColumnContent;
          if (transaction.status.toLowerCase() === 'done') {
            receiptColumnContent = (<button className="bg-indigo-500 text-white py-1 px-2 rounded-md" onClick={(e) => handleDownloadReceipt(e, transaction.transactionId)}>Download Receipt</button>);
          }

          // Return the new data row with "pay" and "receipt" columns
          return {
            ...transaction,
            pay: payColumnContent,
            receipt: receiptColumnContent,
          };
        });
        setData({
          ...transactionsResponse,
          content: processedData,
        });
        setKeysToBeIncluded([
          'serialNo',
          'transactionDate',
          'amount',
          'status',
          'pay',
          'receipt',
        ]);
      } catch (error) {
        console.log(error);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPolicyAccountDetails();
    }
  }, [policyAccountId, id]);

  const handlePayment = async (transactionId) => {
    const requestData = {
      transactionId: transactionId,
      successUrl: `${window.location.origin}/suraksha/payment-success`,
      failureUrl: `${window.location.origin}/suraksha/payment-failure`,
    };


    try {
      console.log(requestData);
      await generateInstallmentPayment(requestData);

    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }
  };

  const handleDownloadReceipt = async (event, transactionId) => {
    event.preventDefault();
    try {

      const response = await generatePaymentReceipt(transactionId);

      const pdfUrl = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'receipt.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    }
  };

  const [form, setForm] = useState({
    policyAccountId: policyAccountId,
    requestType: '',
  });

  const isMatured = new Date(formState.maturedDate) < new Date();




  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={`View Policy Account ${formState.policyAccountId}`} pagePath={"View-Policy-Account"} pageLink={`/suraksha/customer/policy-account`} />
      <section className="content-area-form">
        <form className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Policy Account ID:
              <input
                type="text"
                name="policyAccountId"
                value={formState.policyAccountId}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Created Date:
                <input
                  type="date"
                  name="createdDate"
                  value={formState.createdDate}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Matured Date:
                <input
                  type="date"
                  name="maturedDate"
                  value={formState.maturedDate}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Investment Amount:
                <input
                  type="number"
                  name="investmentAmount"
                  value={formState.investmentAmount}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Claim Amount:
                <input
                  type="number"
                  name="claimAmount"
                  value={formState.claimAmount}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Policy Term:
                <input
                  type="number"
                  name="policyTerm"
                  value={formState.policyTerm}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Payment Time in Months:
                <input
                  type="number"
                  name="paymentTimeInMonths"
                  value={formState.paymentTimeInMonths}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Policy ID:
              <input
                type="text"
                name="policyId"
                value={formState.policyId}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Total Amount Paid:
              <input
                type="number"
                name="totalAmountPaid"
                value={formState.totalAmountPaid}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label className="block text-xl font-medium text-gray-700 mb-1">
              Status:
              <select
                name="isActive"
                value={formState.isActive ? 'Active' : 'Inactive'}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Nominee Name:
                <input
                  type="text"
                  name="nomineeName"
                  value={formState.nomineeName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-1">
                Nominee Relation:
                <input
                  type="text"
                  name="nomineeRelation"
                  value={formState.nomineeRelation}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </label>
            </div>
          </div>

          {withdrawalStatus && (
            <p className="text-sm text-gray-600">{withdrawalStatus}</p>
          )

          }
        </form>

      </section>
      <section className="content-area-form">
        <div className="data-table-information">
          <h3 className="data-table-title border-b">Transactions</h3>
          <div className="data-table-diagram">
            <Table
              data={data}
              keysToBeIncluded={keysToBeIncluded}
              includeButton={false}
              handleButtonClick={null}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              setPage={setCurrentPage}
              setPageSize={setItemsPerPage}
            />
          </div>
        </div>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
