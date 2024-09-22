import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getQueryById } from '../../../services/AdminServices';
import { deleteQueryByCustomer } from '../../../services/CustomerServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const DeleteCustomerQuery = () => {
  const { queryId } = useParams();
  const { customerId } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [queryDetails, setQueryDetails] = useState({
    question: '',
    isResolved: false,
    customerId: customerId,
  });


  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        setLoading(true);
        const response = await getQueryById(queryId); 
        setQueryDetails({
          question: response.question || '',
          isResolved: response.isResolved,
          customerId: response.customerId,
        });
      } catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An unexpected error occurred. Please try again later.");
        }
      }
      finally {
        setLoading(false);
      }
    };

    if(customerId){
      fetchQueryDetails();
    }
  }, [queryId, customerId]);


  const handleDelete = async () => {
    try {
      setLoading(true);
      
      await deleteQueryByCustomer(queryId);
      successToast("Query deleted successfully!");
      navigate("/suraksha/customer/query?filterType=your-unresolved-query");
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred. Please try again later.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop 
        pageTitle={`Delete Query ${queryId}`} 
        pagePath={"Delete-Query"} 
        pageLink={`/suraksha/customer/query?filterType=your-unresolved-query`} 
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
