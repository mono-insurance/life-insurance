import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { getStateById, updateState } from '../../../services/AdminServices';
import { ToastContainer } from 'react-toastify';

export const UpdateState = () => {
  const { id, stateId } = useParams();
  const [formState, setFormState] = useState({
    stateName: '',
    isActive: true,
  });

  // Fetch the state details on component mount
  useEffect(() => {
    const fetchStateDetails = async () => {
      try {
        const response = await getStateById(stateId); // Fetch state by ID
        setFormState({
          stateName: response.stateName || '',
          isActive: response.isActive,
        });
        console.log(response);
        console.log(formState);
      } catch (error) {
        errorToast('Failed to load state details');
      }
    };

    fetchStateDetails();
  }, [stateId]);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission to update the state
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formState.stateName.trim()) {
        errorToast("State name cannot be empty");
        return;
      }

      await updateState(stateId, formState); // Update state by ID

      successToast("State updated successfully!");
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
      } else {
          errorToast("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className='content-area'>
      <AreaTop pageTitle={`Update State ${stateId}`} pagePath={"Update-State"} pageLink={`/admin/get-state/${id}`}/>
      <section className="content-area-form">
        <form className="state-form" onSubmit={handleSubmit}>
          <label className="form-label">
            State Name:<span className="text-danger"> *</span>
            <input 
              type="text" 
              name="stateName" 
              value={formState.stateName}
              onChange={handleChange} 
              className="form-input" 
              placeholder='Enter State Name' 
              required
            />
          </label>

          <label className="form-label">
            Is Active:<span className="text-danger"> *</span>
            <select 
              name="isActive" 
              value={formState.isActive} 
              onChange={handleChange} 
              className="form-input" 
              required
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          <button type="submit" className="form-submit">Update</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};