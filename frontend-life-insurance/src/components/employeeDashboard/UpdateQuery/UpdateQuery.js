import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { getQueryById, updateQuery } from '../../../services/AdminServices';
import { ToastContainer } from 'react-toastify';
import './updateQuery.scss';

export const UpdateEmpQuery = () => {
  const { id, queryId } = useParams();
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
        const response = await getQueryById(queryId); // Fetch query by ID
        setFormState({
          question: response.question || '',
          response: response.response || '',
          isResolved: response.isResolved,
          customerId: response.customerId || '',
        });
      } catch (error) {
        errorToast('Failed to load query details');
      }
    };

    fetchQueryDetails();
  }, [queryId]);

  // Handle form input changes (for response only)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission to update the query
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateQuery(queryId, formState); // Update query by ID

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
      <AreaTop pageTitle={`Update Query ${queryId}`} pagePath={"Update-Query"} pageLink={`/admin/queries/${id}`} />
      <section className="content-area-form">
        <form className="query-form" onSubmit={handleSubmit}>
          {/* Question Field - Read Only */}
          <label className="form-label">
            Question:
            <textarea
              name="question"
              value={formState.question}
              readOnly
              disabled
              className="form-input"
              placeholder='Query Question'
            />
          </label>

          {/* Response Field - Editable */}
          <label className="form-label">
            Response:
            <textarea
              name="response"
              value={formState.response}
              onChange={handleChange}
              className="form-input"
              placeholder='Enter Response'
              required
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
              disabled
              className="form-input"
            />
          </label>

          <button type="submit" className="form-submit">Update</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
