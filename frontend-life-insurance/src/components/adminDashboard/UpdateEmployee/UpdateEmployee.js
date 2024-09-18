import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchEmployeeById, updateEmployee } from '../../../services/AdminServices'; // You'll need to create/update this service
import { validateForm } from '../../../utils/validations/Validations';

export const UpdateEmployee = () => {
  const { id, employeeId } = useParams(); // Get employee ID from the URL parameters
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    qualification: '',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    isActive: true,
    role: 'EMPLOYEE',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await fetchEmployeeById(employeeId); // Fetch existing employee details
        setFormState(employee);
      } catch (error) {
        errorToast('Error fetching employee details.');
      }
    };

    fetchEmployee();
  }, [employeeId]);

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

      await updateEmployee(employeeId, formState); // Update employee details

      successToast('Employee updated successfully!');
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className='content-area'>
      <AreaTop pageTitle={`Update Employee ${employeeId}`} pagePath={"Update-Employee"} pageLink={`/admin/get-employees/${id}`} />
      <section className="content-area-form">
        <form className="employee-form">
          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>First Name:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="text" name="firstName" value={formState.firstName} onChange={handleChange} className="form-input" placeholder='Enter First Name' required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Last Name:</span>
              </div>
              <input type="text" name="lastName" value={formState.lastName} onChange={handleChange} className="form-input" placeholder='Enter Last Name' />
            </label>
          </div>
          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Date of Birth:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleChange} className="form-input" required />
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Qualification:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="text" name="qualification" value={formState.qualification} onChange={handleChange} className="form-input" placeholder='Enter Qualification' required />
            </label>
          </div>
          <label className="form-label">
            <div className="label-container">
              <span>Username:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="text" name="username" value={formState.username} onChange={handleChange} className="form-input" placeholder='Enter Username' required />
          </label>

          <label className="form-label">
            <div className="label-container">
              <span>Email:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="email" name="email" value={formState.email} onChange={handleChange} className="form-input" placeholder='Enter Email' required />
          </label>

          <label className="form-label">
            <div className="label-container">
              <span>Mobile Number:</span>
              <span className="text-danger"> *</span>
            </div>
            <input type="tel" name="mobileNumber" value={formState.mobileNumber} onChange={handleChange} className="form-input" placeholder='Enter Mobile Number' required />
          </label>


          <label className="form-label">
                Is Active:
                <select 
                name="isActive" 
                value={formState.isActive}
                className="form-input"
                >
                <option value={true}>True</option>
                <option value={false}>False</option>
                </select>
            </label>

          <button type="submit" className="form-submit" onClick={handleSubmit}>Update</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
