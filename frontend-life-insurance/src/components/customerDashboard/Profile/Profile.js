import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { customerProfileUpdate, fetchAllDocumentsByCustomer, fetchCustomer, getListOfActiveCitiesByState, updateCustomerAddress, uploadDocumentOfCustomer } from '../../../services/CustomerServices';
import { fetchListOfAllDocuments, getListOfActiveStates } from '../../../services/AdminServices';
import { ToastContainer } from 'react-toastify';
import { validateAddressInfoForm, validatePasswordInfoForm, validatePersonalInfoForm } from '../../../utils/validations/Validations';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { profilePasswordUpdate } from '../../../services/AuthServices';

export const Profile = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [isEdit , setIsEdit] = useState(false);
    const [isEdit2 , setIsEdit2] = useState(false);
    const [isEdit3 , setIsEdit3] = useState(false);
    const { customerId } = useOutletContext();
    const [documents, setDocuments] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocumentDetails, setSelectedDocumentDetails] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


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


    const [originalFormPersonalInfo, setoriginalFormPersonalInfo] = useState({
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
      customerId: customerId,
    });

    const [originalAddressInfo, setOriginalAddressInfo] = useState({
        firstStreet: '',
        lastStreet: '',
        pincode: '',
        state: '',
        city: '',
        customerId: customerId,
    });


    const [formPasswordInfo, setFormPasswordInfo] = useState({
        oldPassword: '',
        newPassword: '',
        retypeNewPassword: '',
        id: customerId,
      });
  
      const [originalPasswordInfo, setOriginalPasswordInfo] = useState({
          oldPassword: '',
          newPassword: '',
          retypeNewPassword: '',
          id: customerId,
      });


    const handleAddressEdit = () => {
        setOriginalAddressInfo(formAddressInfo);
        setIsEdit2(true);
    };

    const handleAddressCancel = () => {
        setFormAddressInfo(originalAddressInfo);
        setIsEdit2(false);
    };

    const handlePersonalEdit = () => {
        setoriginalFormPersonalInfo(formPersonalInfo);
        setIsEdit(true);
    };

    const handlePersonalCancel = () => {
        setFormPersonalInfo(originalFormPersonalInfo);
        setIsEdit(false);
    };

    const handlePasswordEdit = () => {
        setOriginalPasswordInfo(formPasswordInfo);
        setIsEdit3(true);
    };

    const handlePasswordCancel = () => {
        setFormPasswordInfo(originalPasswordInfo);
        setIsEdit3(false);
    };



    const handlePersonalInfoChange = (event) => {
      setFormPersonalInfo({
        ...formPersonalInfo,
        [event.target.name]: event.target.value,
      });
    };


    const handleAddressInfoChange = (event) => {
      setFormAddressInfo({
        ...formAddressInfo,
        [event.target.name]: event.target.value,
      });
    };


    const handlePasswordChange = (event) => {
        setFormPasswordInfo({
          ...formPasswordInfo,
          [event.target.name]: event.target.value,
        });
      };


      const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        try {
          setLoading(true);
  
          const formErrors = validatePasswordInfoForm(formPasswordInfo);
  
          if (Object.keys(formErrors).length > 0) {
            Object.values(formErrors).forEach((errorMessage) => {
              errorToast(errorMessage);
            });
            return;
          }
  
          await profilePasswordUpdate(formPasswordInfo);
          successToast("Your password updated successfully! Need to login again");
          setIsEdit(false);
  
          localStorage.removeItem('auth');
          navigate('/suraksha/login');
        } catch (error) { 
            console.log(error);
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
        }
        finally{
              setLoading(false);
         }
      };


    const handlePersonalInfoSubmit = async (event) => {
      event.preventDefault();
      try {
        setLoading(true);

        const formErrors = validatePersonalInfoForm(formPersonalInfo);

        if (Object.keys(formErrors).length > 0) {
          Object.values(formErrors).forEach((errorMessage) => {
            errorToast(errorMessage);
          });
          return;
        }

        await customerProfileUpdate(formPersonalInfo);
        successToast("Your personal info updated successfully!");
        setIsEdit(false);

      } catch (error) { 
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      }
      finally{
            setLoading(false);
       }
    };


    const handleAddressInfoSubmit = async (event) => {
        event.preventDefault();
        try {
          setLoading(true);

        const formErrors = validateAddressInfoForm(formAddressInfo);

        if (Object.keys(formErrors).length > 0) {
            Object.values(formErrors).forEach((errorMessage) => {
            errorToast(errorMessage);
            });
            return;
        }


          console.log(formAddressInfo);
          await updateCustomerAddress(formAddressInfo);

          successToast("Your address info updated successfully!");
          setIsEdit2(false);

        } catch (error) { 
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
        }
        finally{
            setLoading(false);
        }
      };


    const openDocumentModal = (doc) => {
        setSelectedDocumentDetails(doc);
        setIsModalOpen(true);
    };
    
    // Close document modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDocumentDetails(null);
    };

    const handleDocumentSelection = (e) => {
        setSelectedDocument(e.target.value);
    };
    
   
    const handleDocumentUpload = (e) => {
        const selectedFile = e.target.files[0];
        setUploadedFile(selectedFile);
    };
    
    const handleDocumentSubmit = async () => {
        try{
            setLoading(true);
            if (!selectedDocument || !uploadedFile) {
                errorToast("Please select a document type and upload a file.");
                return;
            }

            const response = await uploadDocumentOfCustomer(selectedDocument, uploadedFile, customerId);
            successToast(response);

            setUploadedFile(null);
            setSelectedDocument("");

        } catch (error) {
            console.log(error);
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred while updating documents. Please try again later.");
          }
        }finally{
            setLoading(false);
        }
    };



    // Fetch customer data and populate the forms
    useEffect(() => {
      const fetchCustomerData = async () => {
        try {
          setLoading(true);

          const customerData = await fetchCustomer(customerId);
          if (customerData) {
            setFormPersonalInfo({ ...customerData});
            // Assuming customerData contains address fields
            setFormAddressInfo({
              firstStreet: customerData.firstStreet || '',
              lastStreet: customerData.lastStreet || '',
              pincode: customerData.pincode || '',
              state: customerData.state || '',
              city: customerData.city || '',
              customerId: customerId,
            });
          }

            const statesResponse = await getListOfActiveStates();
            setStates(statesResponse);

            const documentsNeededData = await fetchListOfAllDocuments();
            setDocuments(documentsNeededData);

            const uploadedDocumentsNeededData = await fetchAllDocumentsByCustomer(customerId);
            setUploadedDocuments(uploadedDocumentsNeededData);

        } catch (error) {
          if (error.response?.data?.message || error.specificMessage) {
              errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred while fetching customer data. Please try again later.");
          }
        }
        finally{
            setLoading(false);
        }
      };

      if (customerId){
        fetchCustomerData();
      }
      
    }, [customerId]);

    

    useEffect(() => {
        const fetchData = async (state) => {
            setLoading(true);
            const citiesResponse = await getListOfActiveCitiesByState(state);
            setCities(citiesResponse);
            setLoading(false);
         }
        if (formAddressInfo.state) {
            fetchData(formAddressInfo.state);
        }
    }, [formAddressInfo.state]);

    
  return (
    <div className='flex flex-col md:flex-row max-w-6xl mx-auto gap-4'>
        {loading && <Loader />}
        <div className="md:w-1/2">
                {/* Personal Info Section */}
                <div className="mb-8">
           <div className='max-w-lg gap-2 text-sm w-full'>
        {isEdit ? (
            <div>
                <input className='bg-gray-50 text-3xl font-medium max-w-60 min-auto mt-4' type="text" name="firstName" value={formPersonalInfo.firstName} onChange={handlePersonalInfoChange} placeholder='Enter First Name' required />
                <input className='bg-gray-50 text-3xl font-medium max-w-60 min-auto mt-4' type="text" name="lastName" value={formPersonalInfo.lastName} onChange={handlePersonalInfoChange} placeholder='Enter Last Name' />
            </div>
            ):(
                <p className='font-medium text-3xl text-neutral-800 mt-4'>{formPersonalInfo.firstName +" "+ formPersonalInfo.lastName}</p>
            )
        }
        <hr className='bg-zinc-400 h-[1px] border-none'/>
        <div >
            <p className='text-neutral-500 underline mt-3'>PERSONAL INFROMATION</p>
            <div className='grid grid-cols-[2fr_2fr] gap-y-2.5 mt-3 text-neutral-700'>
                <p className='font-medium text-lg'>Email:
                {isEdit ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="email" name="email" value={formPersonalInfo.email} onChange={handlePersonalInfoChange} placeholder='Enter Email' required />
                    </div>
                    ):(
                        <p className='text-blue-500 min-w-70'>{formPersonalInfo.email}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Username:
                     <p className='text-blue-400 min-w-70'>{formPersonalInfo.username}</p>
                </p>
                <p className='font-medium text-lg'>Mobile Number:
                {isEdit ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="tel" name="mobileNumber" value={formPersonalInfo.mobileNumber} onChange={handlePersonalInfoChange} placeholder='Enter Mobile Number' required />
                    </div>
                    ):(
                        <p className='text-blue-400 min-w-70'>{formPersonalInfo.mobileNumber}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Date of Birth:
                {isEdit ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="date" name="dateOfBirth" value={formPersonalInfo.dateOfBirth} onChange={handlePersonalInfoChange} placeholder='Enter Date of Birth' required />
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formPersonalInfo.dateOfBirth}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Nominee Name:
                {isEdit ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="text" name="nomineeName" value={formPersonalInfo.nomineeName} onChange={handlePersonalInfoChange} placeholder='Enter Nominee name' required/>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formPersonalInfo.nomineeName}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Nominee Relation:
                {isEdit ? (
                    <div>
                        <select className='bg-gray-100 max-w-70 min-w-70' name="nomineeRelation" value={formPersonalInfo.nomineeRelation} onChange={handlePersonalInfoChange} required>
                            <option value="BROTHER">Brother</option>
                            <option value="SISTER">Sister</option>
                            <option value="MOTHER">Mother</option>
                            <option value="FATHER">Father</option>
                            <option value="SON">Son</option>
                            <option value="DAUGHTER">Daughter</option>
                            <option value="SPOUSE">Spouse</option>
                        </select>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formPersonalInfo.nomineeRelation}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Gender:
                {isEdit ? (
                    <div>
                        <select className='bg-gray-100 max-w-70 min-w-70' name="gender" value={formPersonalInfo.gender} onChange={handlePersonalInfoChange} required>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formPersonalInfo.gender}</p>
                    )
                }
                </p>
            </div>
            <div className='mt-10'>
                {isEdit ? (
                    <>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full mr-5 hover:bg-indigo-500 hover:text-white transition-all'  onClick={handlePersonalCancel}>Cancel</button>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handlePersonalInfoSubmit}>Save</button>
                    </>
                ):(
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handlePersonalEdit}>Edit</button>
                )}
            </div>
        </div>
        </div> 
        </div>
        <div>
        <div className='max-w-lg gap-2 text-sm'>
            <p className='text-neutral-500 underline mt-3'>ADDRESS</p>
            <div className='grid grid-cols-[2fr_2fr] gap-y-2.5 mt-3 text-neutral-700'>
                <p className='font-medium text-lg'>First Street:
                {isEdit2 ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="text" name="firstStreet" value={formAddressInfo.firstStreet} onChange={handleAddressInfoChange}  placeholder='Enter First Street' required/>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formAddressInfo.firstStreet}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Last Street:
                {isEdit2 ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="text" name="lastStreet" value={formAddressInfo.lastStreet} onChange={handleAddressInfoChange} placeholder='Enter Second Street' />
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formAddressInfo.lastStreet}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Pincode:
                {isEdit2 ? (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="text" name="pincode" value={formAddressInfo.pincode} onChange={handleAddressInfoChange} placeholder='Enter Pincode' required/>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formAddressInfo.pincode}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>State:
                {isEdit2 ? (
                    <div>
                        <select className='bg-gray-100 max-w-70 min-w-70' name="state" value={formAddressInfo.state} onChange={handleAddressInfoChange} required>
                            {states.map((state) => (
                                <option key={state.stateId} value={state.stateName}>
                                    {state.stateName}
                                </option>
                            ))}
                        </select>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formAddressInfo.state}</p>
                    )
                }
                </p>
                <p className='font-medium text-lg'>City:
                {isEdit2 ? (
                    <div>
                        <select className='bg-gray-100 max-w-70 min-w-70' name="city" value={formAddressInfo.city} onChange={handleAddressInfoChange} required>
                            {cities.map((city) => (
                                <option key={city.cityId} value={city.cityId}>
                                    {city.cityName}
                                </option>
                            ))}
                        </select>
                    </div>
                    ):(
                        <p className='text-gray-500 min-w-70'>{formAddressInfo.city}</p>
                    )
                }
                </p>
            </div>
            <div className='mt-10'>
                {isEdit2 ? (
                    <>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full mr-5 hover:bg-indigo-500 hover:text-white transition-all'  onClick={handleAddressCancel}>Cancel</button>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handleAddressInfoSubmit}>Save</button>
                    </>
                ):(
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handleAddressEdit}>Edit</button>
                )}
            </div>
        </div>
        </div>
        <div>
        <div className='max-w-lg gap-2 text-sm'>
            <p className='text-neutral-500 underline mt-3'>PASSWORD</p>
            <div className='grid grid-cols-[1fr] gap-y-2.5 mt-3 text-neutral-700'>
                {isEdit3 && (   
                    <div>
                <p className='font-medium text-lg'>Old Password:
                {isEdit3 && (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70 mb-3' type="text" name="oldPassword" value={formPasswordInfo.oldPassword} onChange={handlePasswordChange}  placeholder='Enter Old Password' required/>
                    </div>
                    )
                }
                </p>
                <p className='font-medium text-lg'>New Password:
                {isEdit3 && (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70 mb-3' type="text" name="newPassword" value={formPasswordInfo.newPassword} onChange={handlePasswordChange} placeholder='Enter New Password' required/>
                    </div>
                    )
                }
                </p>
                <p className='font-medium text-lg'>Retype New Password:
                {isEdit3 && (
                    <div>
                        <input className='bg-gray-100 max-w-70 min-w-70' type="password" name="retypeNewPassword" value={formPasswordInfo.retypeNewPassword} onChange={handlePasswordChange} placeholder='Retype New Password' required/>
                    </div>
                    )
                }
                </p>
                </div>
                )}
            </div>
            <div className='mt-10'>
                {isEdit3 ? (
                    <>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full mr-5 hover:bg-indigo-500 hover:text-white transition-all'  onClick={handlePasswordCancel}>Cancel</button>
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handlePasswordSubmit}>Save</button>
                    </>
                ):(
                    <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handlePasswordEdit}>Edit</button>
                )}
            </div>
        </div>
        </div>
        </div>
        <div className="md:w-1/2 mt-12">
                <div className="mb-8">
        <div className='max-w-lg gap-2 text-sm mt-8'>
            <p className='text-neutral-500 underline'>DOCUMENTS</p>

            {/* Dropdown to select a document to upload */}
            <div className='mt-4'>
                <div className="flex items-center">
                        <select className='bg-gray-100 w-auto py-1' name="documentType" value={selectedDocument} onChange={handleDocumentSelection} required>
                            <option value="">Select Document Type</option>
                            {documents.map((doc) => (
                                <option key={doc} value={doc}>
                                    {doc.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <input className='bg-gray-100 w-auto ml-3' type="file" onChange={handleDocumentUpload} />
                    </div>

                    {/* Upload Button on the next line */}
                    <div className="mt-3">
                        <button className='border border-indigo-500 px-8 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition-all' onClick={handleDocumentSubmit}>
                            Upload
                        </button>
                    </div>
                </div>

            {/* Uploaded Documents */}
            <div className='mt-16'>
                <p className='text-neutral-500 underline'>UPLOADED DOCUMENTS</p>
                <div className='grid grid-cols-[1fr] gap-y-2.5 mt-3 text-neutral-700'>
                    {uploadedDocuments.map((doc) => (
                        <div key={doc.documentId} className='flex justify-between items-center'>
                        <p className='font-medium text-lg'>{doc.documentType.replace(/_/g, ' ')}</p>
                        <div className='flex justify-between items-end gap-4'>
                            <p className='font-medium text-sm'>Approved: {doc.isApproved ? 'Yes' : 'No'}</p>
                            <button className='text-blue-500 underline' onClick={() => openDocumentModal(doc)}>View</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Document Modal */}
            {isModalOpen && selectedDocumentDetails && (
                <div className="fixed z-50 inset-0 flex items-center justify-center">
                    {/* Modal backdrop */}
                    <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div> 
                    
                    {/* Modal content */}
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-h-screen max-w-screen-lg overflow-auto">
                    {/* Close button */}
                    <button 
                        className="absolute top-2 right-2 text-xl cursor-pointer" 
                        onClick={closeModal}
                    >
                        &times; {/* Close icon */}
                    </button>

                    {/* Image content */}
                    <img 
                        src={`data:image/jpeg;base64,${selectedDocumentDetails.imageBase64}`} 
                        alt="Document" 
                        className="max-w-full h-auto" 
                    />
                    </div>
                </div>
            )}
        </div>
        </div>
        </div>
        <ToastContainer position="bottom-right" />
    </div>
  )
}
