import React, { useState, useEffect, createRef } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { updatePolicy, getPolicyById, fetchListOfActiveInsuranceCategories, fetchListOfAllDocuments, getPolicyImage, uploadNewPolicyImage } from '../../../services/AdminServices';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { validatePolicyForm } from '../../../utils/validations/Validations';

export const UpdatePolicy = () => {
  const { id, policyId } = useParams(); // Get policyId from the URL parameters
  const [investmentTypes, setInvestmentTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [newImageUploaded, setNewImageUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = createRef();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    policyName: '',
    commissionNewRegistration: '',
    commissionInstallment: '',
    description: '',
    minPolicyTerm: '',
    maxPolicyTerm: '',
    minAge: '',
    maxAge: '',
    minInvestmentAmount: '',
    maxInvestmentAmount: '',
    eligibleGender: 'BOTH',
    insuranceTypeId: '',
    profitRatio: '',
    isActive: true,
    documentsNeeded: []
  });

  // Fetch policy details and associated data (investment types and documents)
  useEffect(() => {
    const fetchPolicyAndData = async () => {
      try {
        setLoading(true);
        const policyResponse = await getPolicyById(policyId);


        setFormState({
          policyName: policyResponse.policyName || '',
          commissionNewRegistration: policyResponse.commissionNewRegistration || '',
          commissionInstallment: policyResponse.commissionInstallment || '',
          description: policyResponse.description || '',
          minPolicyTerm: policyResponse.minPolicyTerm || '',
          maxPolicyTerm: policyResponse.maxPolicyTerm || '',
          minAge: policyResponse.minAge || '',
          maxAge: policyResponse.maxAge || '',
          minInvestmentAmount: policyResponse.minInvestmentAmount || '',
          maxInvestmentAmount: policyResponse.maxInvestmentAmount || '',
          eligibleGender: policyResponse.eligibleGender || 'both',
          insuranceTypeId: policyResponse.insuranceTypeId || '',
          profitRatio: policyResponse.profitRatio || '',
          isActive: policyResponse.isActive,
          documentsNeeded: policyResponse.documentsNeeded || []
        });

        console.log(policyResponse);

        const investmentTypesData = await fetchListOfActiveInsuranceCategories();
        const documentsNeededData = await fetchListOfAllDocuments();
        const image = await getPolicyImage(policyId);

        setInvestmentTypes(investmentTypesData);
        setDocuments(documentsNeededData);
        const imageUrl = URL.createObjectURL(image);
        setImageSrc(imageUrl);
      } catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyAndData();
  }, [policyId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    console.log("coming here or not for file");
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  
    if (selectedFile) {
      setImageSrc(URL.createObjectURL(selectedFile));
      setNewImageUploaded(true); // Flag to mark that a new image was uploaded
    }
  };

  const handleDocumentSelect = (documentId) => {
    setFormState((prevState) => {
      const selectedDocuments = prevState.documentsNeeded.includes(documentId)
        ? prevState.documentsNeeded.filter((id) => id !== documentId)
        : [...prevState.documentsNeeded, documentId];
      return {
        ...prevState,
        documentsNeeded: selectedDocuments,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formErrors = validatePolicyForm(formState);

      if (Object.keys(formErrors).length > 0) {
        Object.values(formErrors).forEach((errorMessage) => {
          errorToast(errorMessage);
        });
        return;
      }

      // Update the policy with new details
      await updatePolicy(policyId, formState);
      successToast("Scheme updated successfully!");

      if (newImageUploaded && file) {
        console.log("coming here or not");
        try {
          await uploadNewPolicyImage(policyId, file);
          successToast("Scheme Image updated successfully!");

        } catch (imageError) {
          errorToast('Failed to upload new image.');
          return;
        }
      }
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
      } else {
          errorToast("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='content-area'>
      {loading && <Loader />}
      <AreaTop pageTitle={`Update Scheme ${policyId}`} pagePath={"Update-Scheme"} pageLink={`/suraksha/admin/get-policy/${id}`} />
      <section className="content-area-form">
        <form className="policy-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Policy Name:<span className="text-danger"> *</span>
            <input type="text" name="policyName" value={formState.policyName} onChange={handleChange} className="form-input" placeholder="Enter Policy Name" required />
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Commission (Registration):</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="commissionNewRegistration" value={formState.commissionNewRegistration} onChange={handleChange} className="form-input" placeholder="Enter Registration Commission" required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Commission (Installment):</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="commissionInstallment" value={formState.commissionInstallment} onChange={handleChange} className="form-input" placeholder="Enter Installment Commission" required />
            </label>
          </div>

          <label className="form-label">
            Description:<span className="text-danger"> *</span>
            <textarea name="description" value={formState.description} onChange={handleChange} className="form-input" placeholder="Enter Policy Description" required />
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Minimum Policy Term:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="minPolicyTerm" value={formState.minPolicyTerm} onChange={handleChange} className="form-input" placeholder="Min Term" required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Maximum Policy Term:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="maxPolicyTerm" value={formState.maxPolicyTerm} onChange={handleChange} className="form-input" placeholder="Max Term" required />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Minimum Age:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="minAge" value={formState.minAge} onChange={handleChange} className="form-input" placeholder="Min Age" required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Maximum Age:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="maxAge" value={formState.maxAge} onChange={handleChange} className="form-input" placeholder="Max Age" required />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Min Investment Amount:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="minInvestmentAmount" value={formState.minInvestmentAmount} onChange={handleChange} className="form-input" placeholder="Min Investment" required />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Max Investment Amount:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="maxInvestmentAmount" value={formState.maxInvestmentAmount} onChange={handleChange} className="form-input" placeholder="Max Investment" required />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Eligible Gender:</span>
                <span className="text-danger"> *</span>
              </div>
              <select name="eligibleGender" value={formState.eligibleGender} onChange={handleChange} className="form-input" required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="BOTH">Both</option>
              </select>
            </label>

            <label className="form-label">
              <div className="label-container">
                <span>Insurance Type:</span>
                <span className="text-danger"> *</span>
              </div>
              <select name="insuranceTypeId" value={formState.insuranceTypeId} onChange={handleChange} className="form-input" required>
                {investmentTypes.map((type) => (
                  <option key={type.typeId} value={type.typeId}>{type.insuranceCategory}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-label">
            Documents Needed:<span className="text-danger"> *</span>
            <DropdownButton id="dropdown-basic-button" title="Select Documents" variant="primary" drop="up" className="custom-dropdown">
              {documents.map((doc) => (
                <Dropdown.Item
                  key={doc}
                  onClick={() => handleDocumentSelect(doc)}
                  active={formState.documentsNeeded.includes(doc)}
                >
                  {doc.replace(/_/g, ' ')}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div className="selected-documents">
              {formState.documentsNeeded.length > 0 && (
                <p>Selected Documents: <br/>{formState.documentsNeeded.join(', ').replace(/_/g, ' ')}</p>
              )}
            </div>
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Profit Ratio (%):</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="number" name="profitRatio" value={formState.profitRatio} onChange={handleChange} className="form-input" placeholder="Profit Ratio" required />
            </label>

            <label className="form-label">
                <div className="label-container">
                    <span>Is Active:</span>
                    <span className="text-danger"> *</span>
                </div>
                <select 
                name="isActive" 
                value={String(formState.isActive)}  // Ensure value is passed as string
                onChange={handleChange} 
                className="form-input" 
                required
                >
                <option value="true">True</option>
                <option value="false">False</option>
                </select>
            </label>

            
          </div>

          <label className="form-label">
              Upload Policy Image:
              <input type="file" name="file" onChange={handleFileChange} className="form-input" ref={fileInputRef} />
              {imageSrc && <img src={imageSrc} alt="Document" style={{ width: '100%' }} />}
            </label>
          

          <button type="submit" className="form-submit">Update Policy</button>
        </form>

        <ToastContainer  position="bottom-right"/>
      </section>
    </div>
  );
};
