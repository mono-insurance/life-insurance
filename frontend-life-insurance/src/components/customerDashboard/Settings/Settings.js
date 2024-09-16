import React, { useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { customerProfileUpdate, fetchCustomer, getListOfActiveCitiesByState, updateCustomerAddress } from '../../../services/CustomerServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import './settings.scss'
import { useParams } from 'react-router-dom';
import { validateForm } from '../../../utils/validations/Validations';
import { getListOfActiveStates } from '../../../services/AdminServices';

export const CustomerSettings = () => {
    const routeParams = useParams();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // State for Personal Info form
    const [formPersonalInfo, setFormPersonalInfo] = useState({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nomineeName: '',
      nomineeRelation: '',
      username: '',
      email: '',
      mobileNumber: '',
    });

    // State for Address Info form
    const [formAddressInfo, setFormAddressInfo] = useState({
      firstStreet: '',
      lastStreet: '',
      pincode: '',
      state: '',
      city: '',
      customerId: routeParams.id,
    });

    // Handle changes for Personal Info form
    const handlePersonalInfoChange = (event) => {
      setFormPersonalInfo({
        ...formPersonalInfo,
        [event.target.name]: event.target.value,
      });
    };

    // Handle changes for Address Info form
    const handleAddressInfoChange = (event) => {
      setFormAddressInfo({
        ...formAddressInfo,
        [event.target.name]: event.target.value,
      });
    };

    // Handle submit for Personal Info form
    const handlePersonalInfoSubmit = async (event) => {
      event.preventDefault();
      try {
        // const formErrors = validateForm(formPersonalInfo);

        // if (Object.keys(formErrors).length > 0) {
        //   Object.values(formErrors).forEach((errorMessage) => {
        //     errorToast(errorMessage);
        //   });
        //   return;
        // }

        await customerProfileUpdate(formPersonalInfo);
        successToast("Your personal info updated successfully!");

      } catch (error) { 
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      }
    };

    // Handle submit for Address Info form
    const handleAddressInfoSubmit = async (event) => {
      event.preventDefault();
      try {
        console.log(formAddressInfo);
        await updateCustomerAddress(formAddressInfo);
        successToast("Your address info updated successfully!");

      } catch (error) { 
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      }
    };

    // Fetch customer data and populate the forms
    useEffect(() => {
      const fetchCustomerData = async () => {
        try {
          const customerData = await fetchCustomer(routeParams.id);
          if (customerData) {
            setFormPersonalInfo({ ...customerData});
            // Assuming customerData contains address fields
            setFormAddressInfo({
              firstStreet: customerData.firstStreet || '',
              lastStreet: customerData.lastStreet || '',
              pincode: customerData.pincode || '',
              state: customerData.state || '',
              city: customerData.city || '',
              customerId: routeParams.id,
            });
          }

        const statesResponse = await getListOfActiveStates();
        setStates(statesResponse);
        
        } catch (error) {
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred while fetching customer data. Please try again later.");
          }
        }
      };

      fetchCustomerData();
    }, []);

    useEffect(() => {
      const fetchData = async (state) => {
        
        const citiesResponse = await getListOfActiveCitiesByState(state);
        setCities(citiesResponse);
    }
    if (formAddressInfo.state) {
      fetchData(formAddressInfo.state);
  }
    }, [formAddressInfo.state]);

  return (
    <div className='content-area'>
        <AreaTop pageTitle={"Settings"} pagePath={"Settings"} pageLink={`/user/transactions/${routeParams.id}`}/>
        
        {/* Personal Info Form */}
        <section className="content-area-form">
          <form className="admin-form" onSubmit={handlePersonalInfoSubmit}>
            <h3 className="data-table-title">Update Personal Info</h3>

            <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>First Name:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="text" name="firstName" value={formPersonalInfo.firstName} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter First Name' required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Last Name:</span>
              </div>
              <input type="text" name="lastName" value={formPersonalInfo.lastName} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter Last Name' />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Date of Birth:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="date" name="dateOfBirth" value={formPersonalInfo.dateOfBirth} onChange={handlePersonalInfoChange} className="form-input" required />
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Gender:</span>
                <span className="text-danger"> *</span>
              </div>
              <select name="gender" value={formPersonalInfo.gender} onChange={handlePersonalInfoChange} className="form-input" required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="BOTH">Both</option>
              </select>
            </label>
          </div>

            <div className="form-row">
              <label className="form-label">
                <div className="label-container">
                  <span>Nominee Name:</span>
                  <span className="text-danger"> *</span>
                </div>
                <input type="text" name="nomineeName" value={formPersonalInfo.nomineeName} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter Nominee name' required/>
              </label>

            
              <label className="form-label">
                <div className="label-container">
                  <span>Nominee Relation:</span>
                  <span className="text-danger"> *</span>
                </div>
                <select name="nomineeRelation" value={formPersonalInfo.nomineeRelation} onChange={handlePersonalInfoChange} className="form-input" required>
                  <option value="BROTHER">Brother</option>
                  <option value="SISTER">Sister</option>
                  <option value="MOTHER">Mother</option>
                  <option value="FATHER">Father</option>
                  <option value="SON">Son</option>
                  <option value="DAUGHTER">Daughter</option>
                  <option value="SPOUSE">Spouse</option>
                </select>
              </label>
            </div>
            <label className="form-label">
            <div className="label-container">
              <span>Username:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="text" name="username" value={formPersonalInfo.username} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter Username' required />
          </label>
          

          <label className="form-label">
            <div className="label-container">
              <span>Email:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="email" name="email" value={formPersonalInfo.email} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter Email' required />
          </label>

          <label className="form-label">
            <div className="label-container">
              <span>Mobile Number:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="tel" name="mobileNumber" value={formPersonalInfo.mobileNumber} onChange={handlePersonalInfoChange} className="form-input" placeholder='Enter Mobile Number' required />
          </label>

          <button type="submit" className="form-submit" onClick={handlePersonalInfoSubmit}>Update Profile</button>
        </form>
        </section>
        {/* Form 2: Address Information */}
        <section className="content-area-form">
        <form className="admin-form" onSubmit={handleAddressInfoSubmit}>
            <h3 className="data-table-title">Address Information</h3>
            <div className="form-row">
                <label className="form-label">
                  <div className="label-container">
                    <span>First Street:</span>
                    <span className="text-danger"> *</span>
                  </div>
                    <input type="text" name="firstStreet" value={formAddressInfo.firstStreet} onChange={handleAddressInfoChange} className="form-input" placeholder='Enter First Street' required/>
                </label>
                <label className="form-label">
                    Second Street:
                    <input type="text" name="lastStreet" value={formAddressInfo.lastStreet} onChange={handleAddressInfoChange} className="form-input" placeholder='Enter Second Street' />
                </label>
            </div>
            <label className="form-label">
              <div className="label-container">
                <span>Pincode:</span>
                <span className="text-danger"> *</span>
              </div>
                <input type="text" name="pincode" value={formAddressInfo.pincode} onChange={handleAddressInfoChange} className="form-input" placeholder='Enter Pincode' required/>
            </label>

            <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>State:</span>
                <span className="text-danger"> *</span>
              </div>
            <select 
              name="state" 
              value={formAddressInfo.state} 
              onChange={handleAddressInfoChange} 
              className="form-input" 
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state.stateName} value={state.stateName}>
                  {state.stateName}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            <div className="label-container">
                <span>City:</span>
                <span className="text-danger"> *</span>
              </div>
            <select 
              name="city" 
              value={formAddressInfo.city} 
              onChange={handleAddressInfoChange} 
              className="form-input" 
              required
            >
              <option value="">Select City</option>
              {cities.map(cities => (
                <option key={cities.cityName} value={cities.cityName}>
                  {cities.cityName}
                </option>
              ))}
            </select>
          </label>
          </div>
            <button type="submit" className="form-submit" onClick={handleAddressInfoSubmit}>Update Address</button>
        </form>
    </section>
    <ToastContainer position="bottom-right" />
        </div>
    );
}
             
