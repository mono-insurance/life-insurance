import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getInsuranceCategoryById, deleteInsuranceCategory } from '../../../services/AdminServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const DeleteInsurance = () => {
  const { id, insuranceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    insuranceCategory: '',
    isActive: true,
  });

  // Fetch existing insurance category details on component mount
  useEffect(() => {
    const fetchInsuranceCategory = async () => {
      try {
        setLoading(true);
        const response = await getInsuranceCategoryById(insuranceId);
        setFormState({
          insuranceCategory: response.insuranceCategory || '',
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

    fetchInsuranceCategory();
  }, [insuranceId]);

  // Handle delete action
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteInsuranceCategory(insuranceId);
      successToast("Insurance category deleted successfully!");
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
      <AreaTop 
        pageTitle={`Delete Insurance Category ${insuranceId}`} 
        pagePath={"Delete-Insurance"} 
        pageLink={`/suraksha/admin/get-insurance-categories/${id}`} 
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
