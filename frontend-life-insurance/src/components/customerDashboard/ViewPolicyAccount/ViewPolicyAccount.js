import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { useParams } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { fetchingTransactionsByPolicyAccountId, getPolicyAccountById, getWithdrawalRequestsByPolicyAccountId, requestForWithdrawalByCustomer } from '../../../services/CustomerServices';
import './viewPolicyAccount.scss';
import { Table } from '../../../sharedComponents/Table/Table';

export const ViewPolicyAccount = () => {
  const { id, policyAccountId } = useParams();
  const [withdrawalStatus, setWithdrawalStatus] = useState(null);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const userId = localStorage.getItem("id")
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


        const withdrawalRequests = await getWithdrawalRequestsByPolicyAccountId(policyAccountId, id);
        if (withdrawalRequests.length > 0) {

          const request = withdrawalRequests;
          if (request.isWithdraw) {
            setWithdrawalStatus('Already withdrawn');
          } else if (request.isApproved) {
            setWithdrawalStatus('Request Approved');
          }
        }
        const transactionsResponse = await fetchingTransactionsByPolicyAccountId(policyAccountId);
        setData(transactionsResponse);
        setKeysToBeIncluded(["transactionId", "transactionDate", "amount", "status"]);
      } catch (error) {
        errorToast('Error fetching policy account details.');
      }
    };

    fetchPolicyAccountDetails();
  }, [policyAccountId]);

  const [form, setForm] = useState({
    policyAccountId: policyAccountId,
    requestType: '',
  });

  const isMatured = new Date(formState.maturedDate) < new Date();

  const handleRequestCancellation = async (event) => {
    event.preventDefault();
    try {
      const updatedForm = {
        ...form,
        requestType: isMatured ? 'ClaimMaturedPolicy' : 'CancelPolicy',
      };

      await requestForWithdrawalByCustomer(updatedForm);

      successToast("Request sent successfully");
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred. Please try again later.");
      }
    }

  };
  const actions = (transactionId) => [
    { name: 'View', url: `/customer/${userId}/perform-transaction/${transactionId}` }
  ]




  return (
    <div className='content-area'>
      <AreaTop pageTitle={`View Policy Account ${formState.policyAccountId}`} pagePath={"View-Policy-Account"} pageLink={`/customer/policy-account/${id}`} />
      <section className="content-area-form">
        <form className="policy-account-form">
          <label className="form-label">
            Policy Account ID:
            <input type="text" name="policyAccountId" value={formState.policyAccountId} className="form-input" readOnly disabled />
          </label>

          <div className="form-row">
            <label className="form-label">
              Created Date:
              <input type="date" name="createdDate" value={formState.createdDate} className="form-input" readOnly disabled />
            </label>
            <label className="form-label">
              Matured Date:
              <input type="date" name="maturedDate" value={formState.maturedDate} className="form-input" readOnly disabled />
            </label>
          </div>


          <div className="form-row">
            <label className="form-label">
              Investment Amount:
              <input type="number" name="investmentAmount" value={formState.investmentAmount} className="form-input" readOnly disabled />
            </label>

            <label className="form-label">
              Claim Amount:
              <input type="number" name="claimAmount" value={formState.claimAmount} className="form-input" readOnly disabled />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Policy Term:
              <input type="number" name="policyTerm" value={formState.policyTerm} className="form-input" readOnly disabled />
            </label>

            <label className="form-label">
              Payment Time in Months:
              <input type="number" name="paymentTimeInMonths" value={formState.paymentTimeInMonths} className="form-input" readOnly disabled />
            </label>
          </div>



          <label className="form-label">
            Policy ID:
            <input type="text" name="policyId" value={formState.policyId} className="form-input" readOnly disabled />
          </label>

          <label className="form-label">
            Total Amount Paid:
            <input type="number" name="totalAmountPaid" value={formState.totalAmountPaid} className="form-input" readOnly disabled />
          </label>


          <label className="form-label">
            Status:
            <select name="isActive" value={formState.isActive ? 'Active' : 'Inactive'} className="form-input" readOnly disabled>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <div className="form-row">
            <label className="form-label">
              Nominee Name:
              <input type="text" name="nomineeName" value={formState.nomineeName} className="form-input" readOnly disabled />
            </label>

            <label className="form-label">
              Nominee Relation:
              <input type="text" name="nomineeRelation" value={formState.nomineeRelation} className="form-input" readOnly disabled />
            </label>
          </div>


          {withdrawalStatus ? (
            <p className="form-submit-para">{withdrawalStatus}</p>
          ) : (
            <>
              {isMatured ? (
                <button className="form-submit" onClick={handleRequestCancellation}>
                  Request for Withdraw
                </button>
              ) : (
                <button className="form-submit" onClick={handleRequestCancellation}>
                  Request for Cancellation
                </button>
              )}
            </>
          )}

        </form>
      </section>
      <section className="content-area-form">
        <div className="data-table-information">
          <h3 className="data-table-title">Transactions</h3>
          <div className="data-table-diagram">
            <Table
              data={data}
              keysToBeIncluded={keysToBeIncluded}
              includeButton={true}
              handleButtonClick={actions}
            />
          </div>
        </div>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
