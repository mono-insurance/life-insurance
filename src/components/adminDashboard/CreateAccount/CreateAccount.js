import React, { useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { ToastContainer } from 'react-toastify'
import './createAccount.scss'
import { Modal } from 'react-bootstrap';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { getCustomerDocument, makeCustomerAccount } from '../../../services/AdminServices';
import { validateBalance, validateCustomerId } from '../../../utils/validations/Validations';

export const CreateAccount = () => {
  const [customerId, setCustomerId] = useState('');
  const [documentType, setDocumentType] = useState(1);
  const [formState, setFormState] = useState({
    accountType: 'savings',
    balance: '',
  });
  const [imageSrc, setImageSrc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const routeParams = useParams();


  const handleChange = (event) => {
    event.preventDefault();
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    try {

      validateCustomerId(customerId);

      const intCustomerId = parseInt(customerId);
      const response = await getCustomerDocument(intCustomerId, documentType);

      const imageUrl = URL.createObjectURL(response);
      setImageSrc(imageUrl);
      setShowModal(true);
    } 
    catch (error) {
      if (error.response && error.response.data instanceof Blob) {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        errorToast(json.message || "An unexpected error occurred.");
      } 
      else if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } 
      else {
          errorToast("An unexpected error occurred. Please try again later.");
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateCustomerId(customerId);
      validateBalance(formState.balance);
      const updatedFormState = {
        ...formState,
        balance: parseFloat(formState.balance),
      };

      const intCustomerId = parseInt(customerId);
      await makeCustomerAccount(intCustomerId, updatedFormState);

      successToast("Account created successfully!");

      setFormState({
        accountType: 'savings',
        balance: '',
      });
      setCustomerId('');
      
    } catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
          errorToast("An unexpected error occurred. Please try again later.");
      }
      
    }
  }

  return (
    <div className='content-area'>
      <AreaTop pageTitle={"Create Account for Existing Customer"} pagePath={"Create-Account"} pageLink={`/admin/dashboard/${routeParams.id}`}/>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton={false}>
            <Modal.Title>{documentType === 1 ? 'Aadhar Card' : 'Pan Card'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {imageSrc && <img src={imageSrc} alt="Document" style={{ width: '100%' }} />}
          </Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={handleCloseModal}>Close</button>
          </Modal.Footer>
        </Modal>

      <section className="content-area-form">
        <div className="account-form">
        <label className="form-label">
          Enter Customer Id:<span className="text-danger"> *</span>
        
        <input type="number" name="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="Enter Customer ID" required/>
        </label>
        <div className="document-row">
          <select value={documentType === 1 ? 'aadhar-card' : 'pan-card'} onChange={(e) => setDocumentType(e.target.value === 'aadhar-card' ? 1 : 2)}>
            <option value="aadhar-card">Aadhar Card</option>
            <option value="pan-card">Pan Card</option>
          </select>
          <button type="submit" className="form-submit" onClick={handleDocumentSubmit}>Get Document</button>
        </div>

        <form className="main-form">
          <div className="form-row">
            <label className="form-label">
              <span>Account Type:<span className="text-danger"> *</span></span>
            
              <select name="accountType" value={formState.accountType} onChange={handleChange}>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
                <option value="salary ">Salary</option>
                <option value="fixed_deposit">Fixed Deposit</option>
                <option value="recurring_deposit">Recurring deposit</option>
              </select>
            </label>
            <label className="form-label">
            <span>Initial Balance:<span className="text-danger"> *</span></span>
            
            <input type="number" name="balance" value={formState.balance} onChange={handleChange} placeholder="Enter Initial Balance" required/>
            </label>
          </div>
          <button type="submit" className="form-submit full-width" onClick={handleSubmit}>Submit</button>
        </form>
        </div>
      </section>
      <ToastContainer position="bottom-right"/>
    </div>
      
  )
}
