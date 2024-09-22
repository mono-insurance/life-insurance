import React, { useState, useEffect, createRef } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addPolicy.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createNewPolicy, fetchListOfActiveInsuranceCategories, fetchListOfAllDocuments } from '../../../services/AdminServices';
import { validateForm, validatePolicyForm } from '../../../utils/validations/Validations';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const AddPolicy = () => {
  const routeParams = useParams();
  
  const [investmentTypes, setInvestmentTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
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
    file: '',
    isActive: true,
    documentsNeeded: []
  });

  const fileInputRef = createRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const investmentTypesData = await fetchListOfActiveInsuranceCategories();
        const documentsNeededData = await fetchListOfAllDocuments();
        setInvestmentTypes(investmentTypesData);
        setDocuments(documentsNeededData);
      } catch (error) {
        if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
      }finally{
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.files[0], // Handling file input
    });
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

      await createNewPolicy(formState);
      successToast("Scheme created successfully!");
      
      setFormState({
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
        investmentTypeId: '',
        profitRatio: '',
        file: '',
        isActive: true,
        documentsNeeded: []
      });

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
      <AreaTop pageTitle={"Create New Scheme"} pagePath={"Create-Scheme"} pageLink={`/suraksha/admin/get-policy/${routeParams.id}`} />
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
              <input type="number" name="commissionNewRegistration" value={formState.commissionRegistration} onChange={handleChange} className="form-input" placeholder="Enter Registration Commission" required />
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
                {investmentTypes.map(type => (
                  <option key={type.typeId} value={type.typeId}>{type.insuranceCategory}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-label">
            Profit Ratio:<span className="text-danger"> *</span>
            <input type="number" name="profitRatio" value={formState.profitRatio} onChange={handleChange} className="form-input" placeholder="Profit Ratio" required />
          </label>

          <label className="form-label">
            Policy Image:<span className="text-danger"> *</span>
            <input type="file" name="file" onChange={handleFileChange} className="form-input" ref={fileInputRef} required />
          </label>

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

          <button type="submit" className="form-submit">Submit</button>
        </form>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
