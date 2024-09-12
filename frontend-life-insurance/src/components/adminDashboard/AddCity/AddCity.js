import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addCity.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createNewCity, fetchStates, getListOfActiveStates } from '../../../services/AdminServices'; 

export const AddCity = () => {
  const routeParams = useParams();
  const [states, setStates] = useState([]); // To hold the list of states
  const [formState, setFormState] = useState({
    cityName: '',
    stateId: '',
    isActive: true,
  });

  // Fetch the list of states when the component mounts
  useEffect(() => {
    const fetchStatesData = async () => {
      try {
        const response = await getListOfActiveStates(); // Fetch states from the server
        setStates(response); // Set the states in the state list
      } catch (error) {
        errorToast("Failed to fetch states. Please try again later.");
      }
    };

    fetchStatesData();
  }, []);

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
      if (!formState.cityName.trim() || !formState.stateId) {
        errorToast("City name and state must be provided");
        return;
      }

      // Create a new city with the city name and selected state
      await createNewCity(formState);

      successToast("City added successfully!");
      setFormState({
        cityName: '',
        stateId: '',
        isActive: true,
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
      <AreaTop pageTitle={"Create New City"} pagePath={"Create-City"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className="content-area-form">
        <form className="city-form" onSubmit={handleSubmit}>
          <label className="form-label">
            City Name:<span className="text-danger"> *</span>
            <input 
              type="text" 
              name="cityName" 
              value={formState.cityName}
              onChange={handleChange} 
              className="form-input" 
              placeholder='Enter City Name' 
              required
            />
          </label>

          <label className="form-label">
            Select State:<span className="text-danger"> *</span>
            <select 
              name="stateId" 
              value={formState.stateId} 
              onChange={handleChange} 
              className="form-input" 
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.stateId} value={state.stateId} name={state.stateId}>
                  {state.stateName}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="form-submit">Submit</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
