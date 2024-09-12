import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './taxSettings.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { addOrUpdateSettings, fetchGlobalSettingsByKey } from '../../../services/AdminServices';

export const TaxSettings = () => {
  const routeParams = useParams();
  const [formState, setFormState] = useState({
    settingKey: 'TAX_CHARGES',
    settingValue: '', // This should be used as 'taxCharges' in the form
  });

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await fetchGlobalSettingsByKey('TAX_CHARGES'); 
        // Assuming response has the settingValue field
        setFormState(prevState => ({
          ...prevState,
          settingValue: response.settingValue || ''
        }));
      } catch (error) {
        errorToast("Failed to fetch tax settings. Please try again later.");
      }
    };

    fetchTaxData();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      settingValue: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formState.settingValue.trim() === '') {
        errorToast("Tax charges cannot be empty");
        return;
      }

      await addOrUpdateSettings(formState);

      successToast("Tax settings updated successfully!");
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
      <AreaTop pageTitle={"Tax Settings"} pagePath={"Tax-Settings"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className="content-area-form">
        <form className="tax-settings-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Tax Charges:<span className="text-danger"> *</span>
            <input 
              type="text" 
              name="taxCharges" // Ensure this matches the formState field
              value={formState.settingValue}
              onChange={handleChange} 
              className="form-input" 
              placeholder='Enter Tax Charges' 
              required
            />
          </label>

          <button type="submit" className="form-submit">Save Tax Charges</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
