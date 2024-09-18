import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { approveOrRejectWithdrawalRequests, fetchWihdrawalRequestById } from '../../../services/AdminServices';
import './viewOrUpdateRequests.scss';

export const ViewOrUpdateRequests = () => {
  const { id, requestsId } = useParams(); // Get request ID from the URL parameters
  const [formState, setFormState] = useState({
    requestType: '',
    amount: '',
    customerId: '',
    agentId: '',
    isApproved: false,
    isWithdraw: false,
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const request = await fetchWihdrawalRequestById(requestsId); // Fetch existing request details
        setFormState(request);
      } catch (error) {
        errorToast('Error fetching request details.');
      }
    };

    fetchRequest();
  }, [requestsId]);

  const handleApprove = async () => {
    try {
      await approveOrRejectWithdrawalRequests(requestsId, true );
      successToast('Request approved successfully!');
    } catch (error) {
      errorToast('Error approving request.');
    }
  };

  const handleReject = async () => {
    try {
      await approveOrRejectWithdrawalRequests(requestsId, false );
      successToast('Request rejected successfully!');
    } catch (error) {
      errorToast('Error rejecting request.');
    }
  };

  return (
    <div className='content-area'>
      <AreaTop pageTitle={`View/Update Request ${requestsId}`} pagePath={"View-Request"} pageLink={`/admin/requests/${id}`} />
      <section className="content-area-form">
        <form className="withdraw-form">
          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Request Type:</span>
              </div>
              <input type="text" name="requestType" value={formState.requestType} readOnly className="form-input" />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Amount:</span>
              </div>
              <input type="text" name="amount" value={formState.amount} readOnly className="form-input" />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Customer ID:</span>
              </div>
              <input type="text" name="customerId" value={formState.customerId} readOnly className="form-input" />
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Agent ID:</span>
              </div>
              <input type="text" name="agentId" value={formState.agentId} readOnly className="form-input" />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Is Approved:</span>
              </div>
              <input type="text" name="isApproved" value={formState.isApproved ? 'True' : 'False'} readOnly className="form-input" />
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Is Withdraw:</span>
              </div>
              <input type="text" name="isWithdraw" value={formState.isWithdraw ? 'True' : 'False'} readOnly className="form-input" />
            </label>
          </div>

          {!formState.isApproved && (
            <div className="form-row">
              <button type="button" className="form-submit-c" onClick={handleApprove}>Approve</button>
              <button type="button" className="form-submit-c" onClick={handleReject}>Reject</button>
            </div>
          )}
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
