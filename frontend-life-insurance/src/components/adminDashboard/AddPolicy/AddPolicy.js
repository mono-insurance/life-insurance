import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './addPolicy.scss';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createNewPolicy, fetchListOfActiveInsuranceCategories, fetchListOfAllDocuments } from '../../../services/AdminServices';
import { validateForm } from '../../../utils/validations/Validations';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export const AddPolicy = () => {
  const routeParams = useParams();

  const [investmentTypes, setInvestmentTypes] = useState([]);
  const [documentsNeeded, setDocumentsNeeded] = useState([]);
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
    eligibleGender: 'both',
    insuranceTypeId: '',
    profitRatio: '',
    image: '',
    isActive: true,
    documents: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investmentTypesData = await fetchListOfActiveInsuranceCategories();
        const documentsNeededData = await fetchListOfAllDocuments();
        setInvestmentTypes(investmentTypesData);
        setDocumentsNeeded(documentsNeededData);
      } catch (error) {
        errorToast('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    console.log("handle change", event.target.value)
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
      const selectedDocuments = prevState.documents.includes(documentId)
        ? prevState.documents.filter((id) => id !== documentId)
        : [...prevState.documents, documentId];
      return {
        ...prevState,
        documents: selectedDocuments,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a FormData object
    const formData = new FormData();

    // Append all form fields to FormData
    for (const key in formState) {
      if (key === 'image') {
        // Append the file separately
        formData.append('file', formState.image);
      } else if (key === 'documents') {
        // Append documents as an array
        formState.documents.forEach((doc, index) => {
          formData.append(`documents[${index}]`, doc);
        });
      } else {
        formData.append(key, formState[key]);
      }
    }
    try {

      // const formErrors = validateForm(formState);

      // if (Object.keys(formErrors).length > 0) {
      //   Object.values(formErrors).forEach((errorMessage) => {
      //     errorToast(errorMessage);
      //   });
      //   return;
      // }
      console.log("in form change", formData)
      await createNewPolicy(formData);
      successToast("Policy created successfully!");

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
        eligibleGender: 'both',
        insuranceTypeId: '',
        profitRatio: '',
        image: '',
        isActive: true,
        documents: []
      });

    } catch (error) {
      errorToast("An error occurred. Please try again.");
    }
  };

  return (
    <div className='content-area'>
      <AreaTop pageTitle={"Create New Policy"} pagePath={"Create-Policy"} pageLink={`/admin/dashboard/${routeParams.id}`} />
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
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
            <input type="file" name="file" onChange={handleFileChange} className="form-input" required />
          </label>

          <label className="form-label">
            Documents Needed:<span className="text-danger"> *</span>
            <DropdownButton id="dropdown-basic-button" title="Select Documents" variant="primary" drop="up" className="custom-dropdown">
              {documentsNeeded.map((doc) => (
                <Dropdown.Item
                  key={doc}
                  onClick={() => handleDocumentSelect(doc)}
                  active={formState.documents.includes(doc)}
                >
                  {doc.replace(/_/g, ' ')}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <div className="selected-documents">
              {formState.documents.length > 0 && (
                <p>Selected Documents: <br />{formState.documents.join(', ').replace(/_/g, ' ')}</p>
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
