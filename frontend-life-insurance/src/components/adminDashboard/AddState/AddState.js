import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addState.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createNewState } from '../../../services/AdminServices';

export const AddState = () => {
  const routeParams = useParams();
  const [formState, setFormState] = useState({
    stateName: '',
    isActive: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formState.stateName.trim()) {
        errorToast("State name cannot be empty");
        return;
      }

      await createNewState(formState);

      successToast("State added successfully!");
      setFormState({
        stateName: '',
        isActive: true,
      });
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
      <AreaTop pageTitle={"Create New State"} pagePath={"Create-State"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
      <section className="content-area-form">
        <form className="state-form">
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

          <button type="submit" className="form-submit" onClick={handleSubmit}>Submit</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};