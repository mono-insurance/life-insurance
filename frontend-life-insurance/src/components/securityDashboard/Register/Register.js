import React, { createRef, useState } from 'react'
import './register.css';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { register } from '../../../services/AuthServices';
import { validateFiles, validateForm } from '../../../utils/validations/Validations';

export const Register = () => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    file1: '',
    file2: '',
    roles: ['USER'],
  };
  const [formState, setFormState] = useState(initialFormState);
  const fileInput1Ref = createRef();
  const fileInput2Ref = createRef();

  const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormState((prevState) => ({
          ...prevState,
          [name]: files ? files[0] : value,
      }));
  };

  const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        console.log(formState);
        validateForm(formState);
        const formErrors = validateForm(formState);
        if (Object.keys(formErrors).length > 0) {
          Object.values(formErrors).forEach((errorMessage) => {
            errorToast(errorMessage);
          });
          return;
        }
        validateFiles(formState.file1);
        validateFiles(formState.file2);

        const formData = new FormData();
        Object.entries(formState).forEach(([key, value]) => {
          if (key === 'file1' || key === 'file2') {
            if (value) {
              formData.append(key, value);
            }
          } else {
            formData.append(key, value);
          }
        });

        await register(formData);

        successToast("Registration successful! Now Login to continue.");
        setFormState(initialFormState);
        if (fileInput1Ref.current) fileInput1Ref.current.value = null;
        if (fileInput2Ref.current) fileInput2Ref.current.value = null;
    } 
    catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
    }
  };

  return (
    <>
    <form>
        <div className="register-container">

            <div className="input-row">
                <div className="input-group">
                    <label><b>First Name</b></label>
                    <input type="text" placeholder="Enter First Name" name="firstName" value={formState.firstName} onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label><b>Last Name</b></label>
                    <input type="text" placeholder="Enter Last Name" name="lastName" value={formState.lastName} onChange={handleChange} />
                </div>
            </div>

            <label><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="username" value={formState.username} onChange={handleChange} required />

            <label><b>Email</b></label>
            <input type="email" placeholder="Enter Email" name="email" value={formState.email} onChange={handleChange} required />

            <label><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="password" value={formState.password} onChange={handleChange} required />

            <div className="input-row">
                <div className="input-group">
                    <label><b>Upload Aadhar Card</b></label>
                    <input type="file" name="file1" onChange={handleChange} ref={fileInput1Ref} required />
                </div>

                <div className="input-group">
                    <label><b>Upload Pan Card</b></label>
                    <input type="file" name="file2" onChange={handleChange} ref={fileInput2Ref} required/>
                </div>
            </div>

            <button type="submit" className="registerbtn" onClick={handleSubmit}>Register</button>
        </div> 
    </form>
    <ToastContainer position="bottom-right"/>
    </>
  )
}
