import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addFeedback.scss'; 
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { addFeedbackByCustomer } from '../../../services/CustomerServices';

export const AddFeedback = () => {
  const routeParams = useParams();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    rating: 5,
    customerId: routeParams.id,
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

      await addFeedbackByCustomer(formState); 

      successToast("Feedback submitted successfully!");
      setFormState({
        title: '',
        description: '',
        rating: 1
      });

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
      <AreaTop pageTitle={"Submit Feedback"} pagePath={"Submit-Feedback"} pageLink={`/customer/policy-account/${routeParams.id}`}/>
      <section className="content-area-form">
        <form className="feedback-form">
            <label className="form-label">
              <div className="label-container">
                <span>Title:</span>
                <span className="text-danger"> *</span>
              </div>
              <input
                type="text"
                name="title"
                value={formState.title}
                onChange={handleChange}
                className="form-input"
                placeholder='Enter Title'
                required
              />
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Description:</span>
                <span className="text-danger"> *</span>
              </div>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleChange}
                className="form-input"
                placeholder='Enter Description'
                rows="4"
                required
              />
            </label>


            <label className="form-label">
              <div className="label-container">
                <span>Rating:</span>
                <span className="text-danger"> *</span>
              </div>
              <select
                name="rating"
                value={formState.rating}
                onChange={handleChange}
                className="form-input"
                required
              >
                {[...Array(5)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Star{ i > 0 && 's'}
                  </option>
                ))}
              </select>
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
