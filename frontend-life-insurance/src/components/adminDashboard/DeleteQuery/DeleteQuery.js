import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { getQueryById, deleteQuery } from '../../../services/AdminServices';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../../../sharedComponents/Loader/Loader';


export const DeleteQuery = () => {
  const { id, queryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    question: '',
    response: '',
    isResolved: false,
    customerId: '',
  });

  // Fetch the query details on component mount
  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        setLoading(true);
        const response = await getQueryById(queryId); // Fetch query by ID
        setFormState({
          question: response.question || '',
          response: response.response || '',
          isResolved: response.isResolved,
          customerId: response.customerId || '',
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

    fetchQueryDetails();
  }, [queryId]);

  // Handle delete action
  const handleDelete = async () => {

    try {
      setLoading(true);
      await deleteQuery(queryId); // Delete query by ID
      successToast("Query deleted successfully!");
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
      <AreaTop pageTitle={`Delete Query ${queryId}`} pagePath={"Delete-Query"} pageLink={`/suraksha/admin/queries/${id}`}/>
      <section className="content-area-form">
        <form className="query-form">
          {/* Question Field - Read Only */}
          <label className="form-label">
            Question:
            <textarea 
              name="question" 
              value={formState.question}
              readOnly 
              className="form-input" 
              placeholder='Query Question'
            />
          </label>

          {/* Response Field - Read Only */}
          <label className="form-label">
            Response:
            <textarea 
              name="response" 
              value={formState.response}
              readOnly 
              className="form-input" 
              placeholder='Response'
            />
          </label>

          {/* IsResolved Field - Read Only */}
          <label className="form-label">
            Is Resolved:
            <select 
              name="isResolved" 
              value={formState.isResolved} 
              readOnly 
              disabled
              className="form-input" 
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          {/* Customer ID - Read Only */}
          <label className="form-label">
            Customer ID:
            <input 
              type="text" 
              name="customerId" 
              value={formState.customerId}
              readOnly 
              className="form-input"
            />
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
