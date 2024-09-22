import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { updateCity, getCityById, getListOfActiveStates } from '../../../services/AdminServices'; 
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const UpdateCity = () => {
  const { id, cityId } = useParams(); // Get cityId from the URL parameters
  const [states, setStates] = useState([]); // To hold the list of states
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    cityName: '',
    stateId: '',
    isActive: true,
  });

  // Fetch the city details and states when the component mounts
  useEffect(() => {
    const fetchCityAndStates = async () => {
      try {
        setLoading(true);
        // Fetch city details by cityId
        const cityResponse = await getCityById(cityId);
        setFormState({
          cityName: cityResponse.cityName || '',
          stateId: cityResponse.stateId || '',
          isActive: cityResponse.isActive,
        });

        // Fetch list of active states
        const statesResponse = await getListOfActiveStates();
        setStates(statesResponse);
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

    fetchCityAndStates();
  }, [cityId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: name === 'isActive' ? (value === 'true') : value, // Convert string to boolean for isActive
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (!formState.cityName.trim() || !formState.stateId) {
        errorToast("City name and state must be provided");
        return;
      }

      // Update the city with the new details
      await updateCity(cityId, formState);

      successToast("City updated successfully!");
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred. Please try again later.");
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={`Update City ${cityId}`} pagePath={"Update-City"} pageLink={`/suraksha/admin/get-city/${id}`} />
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
                <option key={state.stateId} value={state.stateId}>
                  {state.stateName}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Is Active:<span className="text-danger"> *</span>
            <select 
              name="isActive" 
              value={String(formState.isActive)}  // Ensure value is passed as string
              onChange={handleChange} 
              className="form-input" 
              required
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>

          <button type="submit" className="form-submit">Update</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
