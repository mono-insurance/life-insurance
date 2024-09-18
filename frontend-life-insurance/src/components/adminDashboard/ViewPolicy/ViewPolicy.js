import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { useParams } from 'react-router-dom';
import { getPolicyById, fetchListOfActiveInsuranceCategories, fetchListOfAllDocuments, getPolicyImage } from '../../../services/AdminServices';
import { Dropdown } from 'react-bootstrap';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';

export const ViewPolicy = () => {
  const { id, policyId } = useParams(); // Get policyId from the URL parameters
  const [investmentTypes, setInvestmentTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
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
    isActive: true,
    documentsNeeded: []
  });

  // Fetch policy details and associated data (investment types and documents)
  useEffect(() => {
    const fetchPolicyAndData = async () => {
      try {
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

        const investmentTypesData = await fetchListOfActiveInsuranceCategories();
        const documentsNeededData = await fetchListOfAllDocuments();
        const image = await getPolicyImage(policyId);

        setInvestmentTypes(investmentTypesData);
        setDocuments(documentsNeededData);
        const imageUrl = URL.createObjectURL(image);
        setImageSrc(imageUrl);
      } catch (error) {
        errorToast('Error fetching policy details or related data.');
      }
    };

    fetchPolicyAndData();
  }, [policyId]);

  return (
    <div className='content-area'>
      <AreaTop pageTitle={`View Policy ${policyId}`} pagePath={"View-Policy"} pageLink={`/admin/get-policy/${id}`} />
      <section className="content-area-form">
        <form className="policy-form">
          <label className="form-label">
            Policy Name:
            <input type="text" name="policyName" value={formState.policyName} className="form-input" placeholder="Enter Policy Name" readOnly />
          </label>

          <label className="form-label">
            {imageSrc && <img src={imageSrc} alt="Policy" style={{ width: '100%' }} />}
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                Commission (Registration):
              </div>
              <input type="number" name="commissionNewRegistration" value={formState.commissionNewRegistration} className="form-input" placeholder="Enter Registration Commission" readOnly />
            </label>
            <label className="form-label">
              <div className="label-container">
                Commission (Installment):
              </div>
              <input type="number" name="commissionInstallment" value={formState.commissionInstallment} className="form-input" placeholder="Enter Installment Commission" readOnly />
            </label>
          </div>

          <label className="form-label">
            Description:
            <textarea name="description" value={formState.description} className="form-input" placeholder="Enter Policy Description" readOnly />
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                Minimum Policy Term:
              </div>
              <input type="number" name="minPolicyTerm" value={formState.minPolicyTerm} className="form-input" placeholder="Min Term" readOnly />
            </label>
            <label className="form-label">
              <div className="label-container">
                Maximum Policy Term:
              </div>
              <input type="number" name="maxPolicyTerm" value={formState.maxPolicyTerm} className="form-input" placeholder="Max Term" readOnly />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                Minimum Age:
              </div>
              <input type="number" name="minAge" value={formState.minAge} className="form-input" placeholder="Min Age" readOnly />
            </label>
            <label className="form-label">
              <div className="label-container">
                Maximum Age:
              </div>
              <input type="number" name="maxAge" value={formState.maxAge} className="form-input" placeholder="Max Age" readOnly />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                Min Investment Amount:
              </div>
              <input type="number" name="minInvestmentAmount" value={formState.minInvestmentAmount} className="form-input" placeholder="Min Investment" readOnly />
            </label>
            <label className="form-label">
              <div className="label-container">
                Max Investment Amount:
              </div>
              <input type="number" name="maxInvestmentAmount" value={formState.maxInvestmentAmount} className="form-input" placeholder="Max Investment" readOnly />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                Eligible Gender:
              </div>
              <select name="eligibleGender" value={formState.eligibleGender} className="form-input" disabled>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="BOTH">Both</option>
              </select>
            </label>

            <label className="form-label">
              <div className="label-container">
                Insurance Type:
              </div>
              <select name="insuranceTypeId" value={formState.insuranceTypeId} className="form-input" disabled>
                {investmentTypes.map((type) => (
                  <option key={type.typeId} value={type.typeId}>{type.insuranceCategory}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-label">
            <div className="selected-documents">
              {formState.documentsNeeded.length > 0 && (
                <p>Selected Documents: <br/>{formState.documentsNeeded.join(', ').replace(/_/g, ' ')}</p>
              )}
            </div>
          </label>

          <div className="form-row">
            <label className="form-label">
              <div className="label-container">
                <span>Profit Ratio:</span>
                <span className="text-danger"> *</span>
              </div>
              <input type="text" name="profitRatio" value={formState.profitRatio} className="form-input" placeholder="Enter Profit Ratio" readOnly />
            </label>
            <label className="form-label">
              <div className="label-container">
                <span>Status:</span>
                <span className="text-danger"> *</span>
              </div>
              <select name="isActive" value={formState.isActive ? 'Active' : 'Inactive'} className="form-input" disabled>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          {/* Removed/Delete button not needed for view-only */}
        </form>
      </section>
      <ToastContainer  position="bottom-right"/>
    </div>
  );
};
