import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getInsuranceCategoryById, updateInsuranceCategory } from '../../../services/AdminServices';

export const UpdateInsurance = () => {
  const { id, insuranceId } = useParams();
  const [formState, setFormState] = useState({
    insuranceCategory: '',
    isActive: true,
  });

  // Fetch existing insurance category details on component mount
  useEffect(() => {
    const fetchInsuranceCategory = async () => {
      try {
        const response = await getInsuranceCategoryById(insuranceId);
        setFormState({
          insuranceCategory: response.insuranceCategory || '',
          isActive: response.isActive,
        });
      } catch (error) {
        errorToast('Failed to load insurance category details');
      }
    };

    fetchInsuranceCategory();
  }, [insuranceId]);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle submit to update the insurance category
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formState.insuranceCategory.trim()) {
        errorToast("Insurance category name cannot be empty");
        return;
      }

      await updateInsuranceCategory(insuranceId, formState);
      successToast("Insurance category updated successfully!");
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
      <AreaTop pageTitle={`Update Insurance Category ${insuranceId}`} pagePath={"Update-Insurance"} pageLink={`/admin/get-insurance-categories/${id}`} />
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
