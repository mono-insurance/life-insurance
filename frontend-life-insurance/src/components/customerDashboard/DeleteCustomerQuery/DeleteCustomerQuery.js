import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getQueryById } from '../../../services/AdminServices';
import { deleteQueryByCustomer } from '../../../services/CustomerServices';

export const DeleteCustomerQuery = () => {
  const { id, queryId } = useParams();
  
  const [queryDetails, setQueryDetails] = useState({
    question: '',
    isResolved: false,
    customerId: id,
  });


  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        const response = await getQueryById(queryId); 
        setQueryDetails({
          question: response.question || '',
          isResolved: response.isResolved,
          customerId: response.customerId,
        });
      } catch (error) {
        errorToast('Failed to load query details');
      }
    };

    fetchQueryDetails();
  }, [queryId]);


  const handleDelete = async () => {
    try {
      await deleteQueryByCustomer(queryId);
      successToast("Query deleted successfully!");
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
      <AreaTop 
        pageTitle={`Delete Query ${queryId}`} 
        pagePath={"Delete-Query"} 
        pageLink={`/customer/query/${id}`} 
      />
      <section className="content-area-form">
        <form className="query-form">
          <label className="form-label">
            Query:
            <textarea
              name="question"
              value={queryDetails.question}
              className="form-input"
              rows="4"
              style={{ cursor: 'not-allowed' }}
              readOnly
            />
          </label>

          <button 
            type="button" 
            className="form-submit" 
            onClick={handleDelete}
          >
            Delete Query
          </button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
