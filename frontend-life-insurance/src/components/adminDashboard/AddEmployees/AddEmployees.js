import React, { useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addEmployees.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createNewEmployee } from '../../../services/AdminServices'; // You'll need to create this service
import { validateForm } from '../../../utils/validations/Validations';

export const AddEmployees = () => {
  const routeParams = useParams();
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    qualification: '',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: 'EMPLOYEE', // Assuming EMPLOYEE role is predefined
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
      const formErrors = validateForm(formState);

      if (Object.keys(formErrors).length > 0) {
        Object.values(formErrors).forEach((errorMessage) => {
          errorToast(errorMessage);
        });
        return;
      }

      await createNewEmployee(formState); // Make sure this service is defined in EmployeeServices

      successToast("Employee created successfully!");
      setFormState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        qualification: '',
        username: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: 'EMPLOYEE'
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
      <AreaTop pageTitle={"Create New Employee"} pagePath={"Create-Employee"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
      <section className="content-area-form">
      <form className="employee-form">
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
        <div className="form-row">
          <label className="form-label">
          <div className="label-container">
            <span>Date of Birth:</span>
            <span className="text-danger"> *</span>
            </div>
            <input type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleChange} className="form-input" required/>
          </label>

          <label className="form-label">
          <div className="label-container">
              <span>Qualification:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="text" name="qualification" value={formState.qualification} onChange={handleChange} className="form-input" placeholder='Enter Qualification' required/>
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
