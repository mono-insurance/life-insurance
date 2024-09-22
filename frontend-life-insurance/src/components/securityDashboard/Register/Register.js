import React, { createRef, useEffect, useState } from 'react'
import './register.css';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { agentRegistration, customerRegistration, register } from '../../../services/AuthServices';
import { validateFiles, validateForm, validateRegistrationForm } from '../../../utils/validations/Validations';
import { useNavigate } from 'react-router-dom';
import { getListOfActiveCitiesByState, getListOfActiveCitiesByStateId } from '../../../services/CustomerServices';
import { getListOfActiveStates } from '../../../services/AdminServices';
import { de } from 'date-fns/locale';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Register = () => {
  const [userType, setUserType] = useState('customer');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialFormState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    qualification: '',
    nomineeName: '',
    nomineeRelation: '',
    firstStreet: '',
    secondStreet: '',
    pincode: '',
    stateId: '',
    cityId: '',
    file1: '',
    file2: ''
  };
  const [formState, setFormState] = useState(initialFormState);
  const fileInput1Ref = createRef();
  const fileInput2Ref = createRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormState((prevState) => ({
          ...prevState,
          [name]: files ? files[0] : value,
      }));
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  useEffect(() => {
    const fetchStateData = async () => {
      try {
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

    fetchStateData();
  }, []);

  useEffect(() => {
    const fetchData = async (id) => {
      const citiesResponse = await getListOfActiveCitiesByStateId(id);
      setCities(citiesResponse);
      }
      if (formState.stateId) {
        fetchData(formState.stateId);
    }
  }, [formState.stateId]);

  const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const formErrors = validateRegistrationForm(formState, userType);
        if (Object.keys(formErrors).length > 0) {
          Object.values(formErrors).forEach((errorMessage) => {
            errorToast(errorMessage);
          });
          return;
        }

        if(userType === 'agent') {
          validateFiles(formState.file1);
          validateFiles(formState.file2);
        }

        if(userType === 'customer') {
          delete formState.file1;
          delete formState.file2;
          delete formState.qualification;

          formState.role = 'CUSTOMER';
          await customerRegistration(formState); 
        }

        if(userType === 'agent') {
           delete formState.gender;
           delete formState.nomineeName;
           delete formState.nomineeRelation;

           formState.role = 'AGENT'; 
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

            await agentRegistration(formData);
        }

        successToast("Registration successful! Now Login to continue.");

        setFormState(initialFormState);
        if (fileInput1Ref.current) fileInput1Ref.current.value = null;
        if (fileInput2Ref.current) fileInput2Ref.current.value = null;
    } 
    catch (error) {
      console.log(error);
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
      <>
        <form className='min-h-[60vh] max-h-[60vh] overflow-y-auto flex items-center shadow-lg ' onSubmit={handleSubmit}>
          {loading && <Loader />}
          <div className='flex flex-col gap-3 m-auto item-start p-8  border rounded-xl min-w-[550px] max-w-[550px] sm:min-w-[550px] text-zinc-600 text-sm shadow-lg'>
            <p className='text-2xl font-semibold'>Register</p>

            <div className='flex gap-4'>
              <label>
                <input
                  type="radio"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={handleUserTypeChange}
                  required
                />
                Customer
              </label>
              <label>
                <input
                  type="radio"
                  value="agent"
                  checked={userType === 'agent'}
                  onChange={handleUserTypeChange}
                  required
                />
                Agent
              </label>
            </div>
            
            {/* First Name and Last Name in the same line */}
            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>First Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  placeholder="Enter First Name"
                  name="firstName"
                  value={formState.firstName} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className='w-full'>
                <p className='text-lg'>Last Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  placeholder="Enter Last Name"
                  name="lastName"
                  value={formState.lastName} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>Username</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  placeholder="Enter Username"
                  name="username"
                  value={formState.username} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className='w-full'>
                <p className='text-lg'>Email</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formState.email} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password and Mobile Number in the same line */}
            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>Password</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  value={formState.password} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='w-full'>
                <p className='text-lg'>Mobile Number</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="tel"
                  placeholder="Enter Mobile Number"
                  name="mobileNumber"
                  value={formState.mobileNumber} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            
            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>Date of Birth</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="date"
                  name="dateOfBirth"
                  value={formState.dateOfBirth} 
                  onChange={handleChange}
                  required
                />
              </div>

              {userType === 'customer' && (
              <div className='w-full'>
                <p className='text-lg'>Gender</p>
                <select
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  name="gender"
                  value={formState.gender} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>)}
              {userType === 'agent' && (
              <div className='w-full'>
                <p className='text-lg'>Qualification</p>
                <select
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  name="qualification"
                  value={formState.qualification} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Graduated">Graduation</option>

                </select>
                </div>)}
            </div>

            {/* Nominee Name and Nominee Relation in the same line */}
            {userType === 'customer' && (
            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>Nominee Name</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  placeholder="Enter Nominee Name"
                  name="nomineeName"
                  value={formState.nomineeName} 
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='w-full'>
                <p className='text-lg'>Nominee Relation</p>
                <select
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  name="nomineeRelation"
                  value={formState.nomineeRelation} 
                  onChange={handleChange}
                  required
              >
                  <option value="">Select Relation</option>
                  <option value="BROTHER">Brother</option>
                  <option value="SISTER">Sister</option>
                  <option value="MOTHER">Mother</option>
                  <option value="FATHER">Father</option>
                  <option value="SON">Son</option>
                  <option value="DAUGHTER">Daughter</option>
                  <option value="SPOUSE">Spouse</option>
              </select>
              </div>
            </div>
            )}

            {/* Address Fields */}
            <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>First Street</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  placeholder="Enter First Street"
                  value={formState.firstStreet} 
                  name="firstStreet"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='w-full'>
                <p className='text-lg'>Second Street</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="text"
                  value={formState.lastStreet} 
                  placeholder="Enter Second Street"
                  name="secondStreet"
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className='flex justify-between gap-4 w-full'>
              <div className='w-full'>
                <p className='text-lg'>Pincode</p>
                <input
                  className='border border-zinc-300 rounded w-full p-2 mt-1'
                  type="number"
                  value={formState.pincode} 
                  placeholder="Enter Pincode"
                  name="pincode"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='flex justify-between gap-4 w-full'>
                <div className='w-full'>
                  <p className='text-lg'>State</p>
                  <select 
                      name="stateId" 
                      value={formState.stateId} 
                      onChange={handleChange} 
                      className="border border-zinc-300 rounded w-full p-2 mt-1" 
                      required
                    >
                      <option value="">Select State</option>
                      {states.map(state => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                </div>

                <div className='w-full'>
                  <p className='text-lg'>City</p>
                  <select 
                    name="cityId" 
                    value={formState.cityId} 
                    onChange={handleChange} 
                    className="border border-zinc-300 rounded w-full p-2 mt-1" 
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map(cities => (
                      <option key={cities.cityId} value={cities.cityId}>
                        {cities.cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
            </div>

            {userType === 'agent' && (
              <div className='flex justify-between gap-4 w-full'>
                <div className='w-full'>
                  <p className='text-lg'>Aadhar/Pan Card</p>
                  <input
                    className='border border-zinc-300 rounded w-full p-2 mt-1'
                    type="file"
                    name="file1"
                    onChange={handleChange}
                    ref={fileInput1Ref}
                    required
                  />
                </div>

                <div className='w-full'>
                  <p className='text-lg'>Educational Certificate</p>
                  <input
                    className='border border-zinc-300 rounded w-full p-2 mt-1'
                    type="file"
                    name="file2"
                    onChange={handleChange}
                    ref={fileInput2Ref}
                    required
                  />
                </div>
              </div>
            )}

            <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base mt-4' type="submit">
              Register
            </button>
            <p className='mt-4'>Already have an account? 
              <span 
                onClick={() => navigate('/suraksha/login')} 
                className='text-indigo-500 cursor-pointer underline'
              >
                Click here
              </span>
            </p>
          </div>
        </form>
        <ToastContainer position="bottom-right"/>
      </>

  )
}


{/* <>
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
</> */}