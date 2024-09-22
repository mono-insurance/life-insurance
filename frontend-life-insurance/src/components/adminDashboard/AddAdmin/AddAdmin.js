import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addAdmin.scss'; // You can create a separate SCSS file for Admin if needed
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createNewAdmin } from '../../../services/AdminServices'; // You'll need to create this service
import { validateAdminForm, validateForm } from '../../../utils/validations/Validations';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const AddAdmin = () => {
  const routeParams = useParams();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: 'ADMIN', // Assuming ADMIN role is predefined
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
      setLoading(true);
      const formErrors = validateAdminForm(formState);

      if (Object.keys(formErrors).length > 0) {
        Object.values(formErrors).forEach((errorMessage) => {
          errorToast(errorMessage);
        });
        return;
      }

      await createNewAdmin(formState);

      successToast("Admin created successfully!");
      setFormState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: 'ADMIN'
      });

    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
      } else {
          errorToast("An unexpected error occurred. Please try again later.");
      }
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={"Create New Admin"} pagePath={"Create-Admin"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
      <section className="content-area-form">
        <form className="admin-form">
            <div className="form-row">
            <label className="form-label">
            <div className="label-container">
                <span>First Name:</span>
                <span className="text-danger"> *</span>
            </div>
            <input type="text" name="firstName" value={formState.firstName} onChange={handleChange} className="form-input" placeholder='Enter First Name' required/>
            </label>
            <label className="form-label">
                Last Name:
                <input type="text" name="lastName" value={formState.lastName} onChange={handleChange} className="form-input" placeholder='Enter Last Name'/>
            </label>
            </div>

        <label className="form-label">
          Username:<span className="text-danger"> *</span>
          <input type="text" name="username" value={formState.username} onChange={handleChange} className="form-input" placeholder='Enter Username' required/>
        </label>

        <label className="form-label">
          Email:<span className="text-danger"> *</span>
          <input type="email" name="email" value={formState.email} onChange={handleChange} className="form-input" placeholder='Enter Email' required/>
        </label>

        <label className="form-label">
          Password:<span className="text-danger"> *</span>
          <input type="password" name="password" value={formState.password} onChange={handleChange} className="form-input" placeholder='Enter Password' required/>
        </label>

        <label className="form-label">
          Mobile Number:<span className="text-danger"> *</span>
          <input type="tel" name="mobileNumber" value={formState.mobileNumber} onChange={handleChange} className="form-input" placeholder='Enter Mobile Number' required/>
        </label>

        <button type="submit" className="form-submit" onClick={handleSubmit}>Submit</button>
      </form>
      </section>
      <ToastContainer position="bottom-right"/>
    </div>
  );
};
