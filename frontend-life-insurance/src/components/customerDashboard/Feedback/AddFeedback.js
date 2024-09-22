import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addFeedback.scss'; 
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { addFeedbackByCustomer } from '../../../services/CustomerServices';
import { useOutletContext } from 'react-router-dom';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { StarRating } from '../../../sharedComponents/StarRating/StarRating';
import { validateFeedbackForm } from '../../../utils/validations/Validations';

export const AddFeedback = () => {
  const {customerId} = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    rating: 1,
    customerId: customerId,
  });

  const handleRatingChange = (newRating) => {
    setFormState({
      ...formState,
      rating: newRating,
    });
  };

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const formErrors = validateFeedbackForm(formState);

      if (Object.keys(formErrors).length > 0) {
        Object.values(formErrors).forEach((errorMessage) => {
          errorToast(errorMessage);
        });
        return;
      }

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
    finally {
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={"Submit Feedback"} pagePath={"Submit-Feedback"} pageLink={`/suraksha/insurances`}/>
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

            <div className='flex justify-content items-center flex-col'>
            <StarRating rating={formState.rating} onRatingChange={handleRatingChange}/>
            </div>

          <button type="submit" className="form-submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </section>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};
