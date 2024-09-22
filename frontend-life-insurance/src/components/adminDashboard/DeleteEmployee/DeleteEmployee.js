import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { fetchEmployeeById, deleteEmployee } from '../../../services/AdminServices'; // Ensure these services are defined
import { set } from 'date-fns';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const DeleteEmployee = () => {
  const { id, employeeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
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
        setLoading(true);
        const fetchedEmployee = await fetchEmployeeById(employeeId);
        setEmployee(fetchedEmployee);
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

    fetchEmployee();
  }, [employeeId]);

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await deleteEmployee(employeeId);
      successToast('Employee deleted successfully!');
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast('An unexpected error occurred. Please try again later.');
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={`Delete Employee ${employeeId}`} pagePath={"Delete-Employee"} pageLink={`/suraksha/admin/get-employees/${id}`} />
      <section className="content-area-form">
        <form className="employee-form">
              <div className="form-row">
                <label className="form-label">
                  <div className="label-container">
                    <span>First Name:</span>
                    <span className="text-danger"> *</span>
                  </div>
                  <input type="text" name="firstName" value={employee.firstName} readOnly className="form-input" />
                </label>
                <label className="form-label">
                  <div className="label-container">
                    <span>Last Name:</span>
                  </div>
                  <input type="text" name="lastName" value={employee.lastName} readOnly className="form-input" />
                </label>
              </div>
              <div className="form-row">
                <label className="form-label">
                  <div className="label-container">
                    <span>Date of Birth:</span>
                  </div>
                  <input type="date" name="dateOfBirth" value={employee.dateOfBirth} readOnly className="form-input" />
                </label>

                <label className="form-label">
                  <div className="label-container">
                    <span>Qualification:</span>
                  </div>
                  <input type="text" name="qualification" value={employee.qualification} readOnly className="form-input" />
                </label>
              </div>
              <label className="form-label">
                <div className="label-container">
                  <span>Username:</span>
                </div>
                <input type="text" name="username" value={employee.username} readOnly className="form-input" />
              </label>

              <label className="form-label">
                <div className="label-container">
                  <span>Email:</span>
                </div>
                <input type="email" name="email" value={employee.email} readOnly className="form-input" />
              </label>

              <label className="form-label">
                <div className="label-container">
                  <span>Mobile Number:</span>
                </div>
                <input type="tel" name="mobileNumber" value={employee.mobileNumber} readOnly className="form-input" />
              </label>


              <label className="form-label">
                Is Active:
                <select 
                name="isActive" 
                value={employee.isActive} 
                disabled
                className="form-input readonly-input" 
                style={{ cursor: 'not-allowed' }}
                >
                <option value={true}>True</option>
                <option value={false}>False</option>
                </select>
            </label>

              <button type="button" className="form-submit" onClick={handleDelete}>Delete</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

