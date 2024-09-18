import React, { createRef, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { register, getAllStates } from '../../../services/AuthServices';
import { validateFiles, validateForm } from '../../../utils/validations/Validations';

export const Register = () => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nomineeName: '',
    nomineeRelation: '',
    firstStreet: '',
    lastStreet: '',
    pincode: '',
    stateId: '',
    cityId: '',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    role: ''
  };

  const [formState, setFormState] = useState(initialFormState);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const fileInput1Ref = createRef();
  const fileInput2Ref = createRef();

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await getAllStates();
      setStates(response.data.content);
    } catch (error) {
      errorToast("Error fetching states.");
    }
  };

  const handleStateChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const selectedState = states.find((state) => state.stateId.toString() === value);
    setCities(selectedState.cities ? selectedState.cities : []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formErrors = validateForm(formState);
      if (Object.keys(formErrors).length > 0) {
        Object.values(formErrors).forEach((errorMessage) => {
          errorToast(errorMessage);
        });
        return;
      }

      const formData = new FormData();

      // Append form data fields
      Object.keys(formState).forEach((key) => {
        formData.append(key, formState[key]);
      });

      // Add files if necessary (assuming fileInput1Ref, fileInput2Ref are used for files)
      if (fileInput1Ref.current && fileInput1Ref.current.files[0]) {
        formData.append('file1', fileInput1Ref.current.files[0]);
      }
      if (fileInput2Ref.current && fileInput2Ref.current.files[0]) {
        formData.append('file2', fileInput2Ref.current.files[0]);
      }

      // Send the form data
      await register(formState);
      successToast("Registration successful! Now Login to continue.");
      setFormState(initialFormState);

      if (fileInput1Ref.current) fileInput1Ref.current.value = null;
      if (fileInput2Ref.current) fileInput2Ref.current.value = null;
    } catch (error) {
      errorToast(error.response?.data?.message || error.specificMessage || "An unexpected error occurred. Please try again later.");
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 p-8 w-[800px] mx-auto bg-white shadow-md rounded-lg">

          {/* First Name and Last Name */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>First Name</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter First Name" name="firstName" value={formState.firstName} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Last Name</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Last Name" name="lastName" value={formState.lastName} onChange={handleChange} />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Date of Birth</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Gender</b></label>
              <select className="w-full p-2 border border-gray-300 rounded" name="gender" value={formState.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="BOTH">BOTH</option>
              </select>
            </div>
          </div>

          {/* Nominee Name and Nominee Relation */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Nominee Name</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Nominee Name" name="nomineeName" value={formState.nomineeName} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Nominee Relation</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Nominee Relation" name="nomineeRelation" value={formState.nomineeRelation} onChange={handleChange} required />
            </div>
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold"><b>Qualification</b></label>
            <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Mobile Number" name="qualification" value={formState.qualification} onChange={handleChange} required />
          </div>

          {/* Address Details */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>First Street</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter First Street" name="firstStreet" value={formState.firstStreet} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Last Street</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Last Street" name="lastStreet" value={formState.lastStreet} onChange={handleChange} />
            </div>
          </div>

          {/* Pincode, State, and City */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Pincode</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Pincode" name="pincode" value={formState.pincode} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>State</b></label>
              <select className="w-full p-2 border border-gray-300 rounded" name="stateId" value={formState.stateId} onChange={handleStateChange} required>
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold"><b>City</b></label>
            <select className="w-full p-2 border border-gray-300 rounded" name="cityId" value={formState.cityId} onChange={handleChange} required>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          {/* Username, Email, Password */}
          <div className='flex gap-4'>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Username</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Username" name="username" value={formState.username} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Email</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="email" placeholder="Enter Email" name="email" value={formState.email} onChange={handleChange} required />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Password</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="password" placeholder="Enter Password" name="password" value={formState.password} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-semibold"><b>Mobile Number</b></label>
              <input className="w-full p-2 border border-gray-300 rounded" type="text" placeholder="Enter Mobile Number" name="mobileNumber" value={formState.mobileNumber} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-semibold"><b>Role</b></label>
            <select className="w-full p-2 border border-gray-300 rounded" name="role" value={formState.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="AGENT">Agent</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">Register</button>
          </div>

        </div>
      </form>
      <div className="text-center mb-10 mt-4">
        <span>Already have an account? </span>
        <a
          href="/"
          className="text-blue-500 hover:underline"
        >
          Login here
        </a>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default Register;

