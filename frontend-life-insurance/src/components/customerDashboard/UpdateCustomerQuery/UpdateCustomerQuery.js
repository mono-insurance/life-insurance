import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getQueryById } from '../../../services/AdminServices';
import { updateQueryByCustomerEnd } from '../../../services/CustomerServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const UpdateCustomerQuery = () => {
  const {queryId } = useParams();
  const {customerId} = useOutletContext();
  const [loading, setLoading] = useState(true);
  
  const [formState, setFormState] = useState({
    question: '',
    isResolved: false,
    customerId: customerId,
  });

  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        setLoading(true);
        const response = await getQueryById(queryId); 
        setFormState({
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
      setLoading(true);
      if (!formState.question.trim()) {
        errorToast("Question field cannot be empty");
        return;
      }

      await updateQueryByCustomerEnd(queryId, formState);

      successToast("Query updated successfully!");
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
      <AreaTop pageTitle={`Update Query ${queryId}`} pagePath={"Update-Query"} pageLink={'/suraksha/customer/query?filterType=your-unresolved-query'} />
      <section className="content-area-form">
        <form className="query-form" onSubmit={handleSubmit}>
          <label className="form-label">
            <div className="label-container">
              <span>Question:</span>
              <span className="text-danger"> *</span>
            </div>
            <textarea
              name="question"
              value={formState.question}
              onChange={handleChange}
              className="form-input"
              placeholder='Update your question'
              rows="4"
              required
            />
          </label>
          <button type="submit" className="form-submit">Update</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
