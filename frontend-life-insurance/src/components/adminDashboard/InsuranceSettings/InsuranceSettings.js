import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './insuranceSettings.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { addOrUpdateSettings, fetchGlobalSettingsByKey } from '../../../services/AdminServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const InsuranceSettings = () => {
  const routeParams = useParams();
  const [loading, setLoading] = useState(false);
  
  const [cancellationChargesState, setCancellationChargesState] = useState({
    settingKey: 'CANCELLATION_CHARGES',
    settingValue: '',
  });
  
  const [penaltyChargesState, setPenaltyChargesState] = useState({
    settingKey: 'PENALTY_CHARGES',
    settingValue: '',
  });

  useEffect(() => {
    const fetchInsuranceData = async () => {
      try {
        setLoading(true);
        const cancellationResponse = await fetchGlobalSettingsByKey('CANCELLATION_CHARGES');
        
        const penaltyResponse = await fetchGlobalSettingsByKey('PENALTY_CHARGES');
        
        
        setCancellationChargesState(prevState => ({
          ...prevState,
          settingValue: cancellationResponse.settingValue || ''
        }));
        
        setPenaltyChargesState(prevState => ({
          ...prevState,
          settingValue: penaltyResponse.settingValue || ''
        }));
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

    fetchInsuranceData();
  }, []);

  const handleCancellationChargesChange = (event) => {
    const { value } = event.target;
    setCancellationChargesState(prevState => ({
      ...prevState,
      settingValue: value,
    }));
  };

  const handlePenaltyChargesChange = (event) => {
    const { value } = event.target;
    setPenaltyChargesState(prevState => ({
      ...prevState,
      settingValue: value,
    }));
  };

  const handleCancellationChargesSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (cancellationChargesState.settingValue.trim() === '') {
        errorToast("Cancellation charges cannot be empty");
        return;
      }

      await addOrUpdateSettings(cancellationChargesState);

      successToast("Cancellation charges updated successfully!");
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

  const handlePenaltyChargesSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (penaltyChargesState.settingValue.trim() === '') {
        errorToast("Penalty charges cannot be empty");
        return;
      }

      await addOrUpdateSettings(penaltyChargesState);

      successToast("Penalty charges updated successfully!");
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
      <AreaTop pageTitle={"Insurance Settings"} pagePath={"Insurance-Settings"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`} />
      <section className="content-area-form">
        <form className="insurance-settings-form" onSubmit={handleCancellationChargesSubmit}>
          <label className="form-label">
            Cancellation Charges:<span className="text-danger"> *</span>
            <input 
              type="text" 
              value={cancellationChargesState.settingValue}
              onChange={handleCancellationChargesChange} 
              className="form-input" 
              placeholder='Enter Cancellation Charges' 
              required
            />
            <button type="submit" className="form-submit">Save Cancellation Charges</button>
          </label>
        </form>

        <form className="insurance-settings-form" onSubmit={handlePenaltyChargesSubmit}>
          <label className="form-label">
            Penalty Charges:<span className="text-danger"> *</span>
            <input 
              type="text" 
              value={penaltyChargesState.settingValue}
              onChange={handlePenaltyChargesChange} 
              className="form-input" 
              placeholder='Enter Penalty Charges' 
              required
            />
            <button type="submit" className="form-submit">Save Penalty Charges</button>
          </label>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
