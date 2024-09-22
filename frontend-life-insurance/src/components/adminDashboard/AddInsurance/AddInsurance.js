import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addInsurance.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createNewInsuranceCategory } from '../../../services/AdminServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const AddInsurance = () => {
  const routeParams = useParams();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    insuranceCategory: '',
    isActive: true,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("name:", name, "value:", value);
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (!formState.insuranceCategory.trim()) {
        errorToast("Insurance category name cannot be empty");
        return;
      }

      await createNewInsuranceCategory(formState);

      successToast("Insurance category added successfully!");
      setFormState({
        insuranceCategory: '',
        isActive: true,
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

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={"Create New Insurance Category"} pagePath={"Create-Insurance"} pageLink={`/suraksha/admin/get-insurance-categories/${routeParams.id}`} />
      <section className="content-area-form">
        <form className="insurance-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Insurance Category Name:<span className="text-danger"> *</span>
            <input 
              type="text" 
              name="insuranceCategory" 
              value={formState.insuranceCategory}
              onChange={handleChange} 
              className="form-input" 
              placeholder='Enter Insurance Category Name' 
              required
            />
          </label>

          <button type="submit" className="form-submit">Submit</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
