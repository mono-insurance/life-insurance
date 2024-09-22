import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addQuery.scss'; 
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { addQueryByCustomer } from '../../../services/CustomerServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const AddQuery = () => {
  const {customerId} = useOutletContext();
  const [loading, setLoading] = useState(false);
  
  const [formState, setFormState] = useState({
    question: '',
    response: '',
    isResolved: false,
    customerId: customerId,
  });

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formState.question) {
        errorToast("Question field cannot be empty");
        return;
      }
      setLoading(true);
      await addQueryByCustomer(formState);
      

      successToast("Query submitted successfully!");
      setFormState({
        question: '',
        response: '',
        isResolved: false,
        customerId: customerId,
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

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={"Submit Query"} pagePath={"Submit-Query"} pageLink={`/suraksha/customer/query`} />
      <section className="content-area-form">
        <form className="query-form">
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
              placeholder='Enter your question'
              rows="4"
              required
            />
          </label>

          <button type="submit" className="form-submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </section>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};
