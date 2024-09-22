import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { getStateById, deleteState } from '../../../services/AdminServices';
import { ToastContainer } from 'react-toastify';
import { set } from 'date-fns';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const DeleteState = () => {
  const { id, stateId } = useParams();
  const [loading, setLoading] = useState(false);
  const [stateDetails, setStateDetails] = useState({
    stateName: '',
    isActive: true,
  });

  // Fetch state details on component mount
  useEffect(() => {
    const fetchStateDetails = async () => {
      try {
        setLoading(true);
        const response = await getStateById(stateId);
        setStateDetails({
          stateName: response.stateName || '',
          isActive: response.isActive,
        });
      } catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStateDetails();
  }, [stateId]);

  // Handle the state deletion
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteState(stateId); // Call delete API
      successToast("State deleted successfully!");
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

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop 
        pageTitle={`Delete State ${stateId}`} 
        pagePath={"Delete-State"} 
        pageLink={`/suraksha/admin/get-state/${id}`} 
      />
      <section className="content-area-form">
        <form className="state-form">
          <label className="form-label">
            State Name:
            <input 
              type="text" 
              name="stateName" 
              value={stateDetails.stateName} 
              className="form-input" 
              style={{ cursor: 'not-allowed' }}
              readOnly // Making the field non-editable
            />
          </label>

          <label className="form-label">
            Is Active:
            <select 
              name="isActive" 
              value={stateDetails.isActive} 
              className="form-input readonly-input" 
              style={{ cursor: 'not-allowed' }}
              disabled
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          <button 
            type="button" 
            className="form-submit delete-button" 
            onClick={handleDelete}
          >
            Delete
          </button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
