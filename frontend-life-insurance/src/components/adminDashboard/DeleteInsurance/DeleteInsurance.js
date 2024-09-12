import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getInsuranceCategoryById, deleteInsuranceCategory } from '../../../services/AdminServices';

export const DeleteInsurance = () => {
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

  // Handle delete action
  const handleDelete = async () => {
    try {
      await deleteInsuranceCategory(insuranceId);
      successToast("Insurance category deleted successfully!");
    } catch (error) {
      errorToast("Failed to delete the insurance category. Please try again.");
    }
  };

  return (
    <div className='content-area'>
      <AreaTop 
        pageTitle={`Delete Insurance Category ${insuranceId}`} 
        pagePath={"Delete-Insurance"} 
        pageLink={`/admin/get-insurance-categories/${id}`} 
      />
      <section className="content-area-form">
        <form className="insurance-form">
          <label className="form-label">
            Insurance Category Name:
            <input 
              type="text" 
              name="insuranceCategory" 
              value={formState.insuranceCategory}
              className="form-input" 
              style={{ cursor: 'not-allowed' }} // Changing the cursor to not-allowed
              readOnly // Making the field non-editable
            />
          </label>

          <label className="form-label">
            Is Active:
            <select 
              name="isActive" 
              value={formState.isActive} 
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
            className="form-submit"
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
