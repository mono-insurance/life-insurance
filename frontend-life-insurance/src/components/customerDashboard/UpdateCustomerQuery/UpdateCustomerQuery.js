import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { getQueryById } from '../../../services/AdminServices';
import { updateQueryByCustomerEnd } from '../../../services/CustomerServices';

export const UpdateCustomerQuery = () => {
  const { id, queryId } = useParams(); // `id` refers to customerId and `queryId` to the query being updated
  const [formState, setFormState] = useState({
    question: '',
    isResolved: false,
    customerId: id, // Using customerId from route parameters
  });

  // Fetch query details on component mount
  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        const response = await getQueryById(queryId); // Fetch query by ID
        setFormState({
          question: response.question || '',
          isResolved: response.isResolved,
          customerId: response.customerId,
        });
      } catch (error) {
        errorToast('Failed to load query details');
      }
    };

    fetchQueryDetails();
  }, [queryId, id]);


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
  };

  return (
    <div className='content-area'>
      <AreaTop pageTitle={`Update Query ${queryId}`} pagePath={"Update-Query"} pageLink={`/customer/query/${id}`} />
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
