import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { getCityById, deleteCityById, deleteCity } from '../../../services/AdminServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const DeleteCity = () => {
  const { id, cityId } = useParams(); // Get cityId from the URL parameters
  const [loading, setLoading] = useState(false);
  const [cityDetails, setCityDetails] = useState({
    cityName: '',
    stateName: '',
    isActive: true,
  });

  // Fetch the city details when the component mounts
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const cityResponse = await getCityById(cityId);

        setCityDetails({
          cityName: cityResponse.cityName || '',
          stateName: cityResponse.stateName || '',
          isActive: cityResponse.isActive,
        });
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

    fetchCityData();
  }, [cityId]);

  // Handle deletion of the city
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCity(cityId);
      successToast('City deleted successfully!');
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

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={`Delete City ${cityId}`} pagePath={"Delete-City"} pageLink={`/suraksha/admin/get-city/${id}`} />
      <section className="content-area-form">
        <form className="city-form">
          <label className="form-label">
            City Name:
            <input 
              type="text" 
              name="cityName" 
              value={cityDetails.cityName} 
              readOnly
              className="form-input readonly-input" 
              style={{ cursor: 'not-allowed' }}
            />
          </label>

          <label className="form-label">
            State Name:
            <input 
              type="text" 
              name="stateName" 
              value={cityDetails.stateName} 
              readOnly
              className="form-input readonly-input" 
              style={{ cursor: 'not-allowed' }}
            />
          </label>

          <label className="form-label">
            Is Active:
            <select 
              name="isActive" 
              value={cityDetails.isActive} 
              disabled
              className="form-input readonly-input" 
              style={{ cursor: 'not-allowed' }}
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          <div className="buttons">
            <button 
                type="button" 
                className="form-submit delete-button" 
                onClick={handleDelete}
            >
                Delete
            </button>
          </div>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
