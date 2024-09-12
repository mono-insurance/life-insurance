import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';
import { activateParticularAccount, getAllActiveAccounts, getAllInactiveAccounts, makeAllRequestsAccountActivate } from '../../../services/AdminServices';
import { validateAccountNumber } from '../../../utils/validations/Validations';
import { ToastContainer } from 'react-toastify';

export const ActivateAccounts = () => {
  const [newlyActivated, setNewlyActivated] = useState(false);
  const [activatedData, setActivatedData] = useState('');
  const [data, setData] = useState([]);
  const [showActiveAccounts, setShowActiveAccounts] = useState(false);
  const [showInactiveAccounts, setShowInactiveAccounts] = useState(false);
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const {currentPage, itemsPerPage, resetPagination} = useContext(PaginationContext);
  const [accountNumber, setAccountNumber] = useState('');
  const routeParams = useParams();



  const handleFormSubmit = async(e) => {
    e.preventDefault();
    try {
      validateAccountNumber(accountNumber);

      await activateParticularAccount(accountNumber);

      successToast("Account has been activated successfully!");
      setAccountNumber('');
    } 
    catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An error occurred while Activating account.");
      }
    }
  }

  const handleActivateAccounts = async (e) => {
    e.preventDefault();
    try {

      const response = await makeAllRequestsAccountActivate();

      console.log(response);
      setActivatedData(response);
      setNewlyActivated(true);

    } 
    catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An error occurred while deactivating accounts.");
      }
    }
  };


  const fetchActiveAccounts = async () => {
    try {
        const response = await getAllActiveAccounts(currentPage, itemsPerPage);

        setData(response);
        setKeysToBeIncluded(["accountNumber", "accountType", "balance", "active"]);
        setShowActiveAccounts(true);
        setShowInactiveAccounts(false);
      }
      catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while deactivating accounts.");
        }
      }
  }

  const fetchInactiveAccounts = async () => {
    try {
        const response = await getAllInactiveAccounts(currentPage, itemsPerPage);
        setData(response);
        setKeysToBeIncluded(["accountNumber", "accountType", "balance", "active"]);
        setShowInactiveAccounts(true);
        setShowActiveAccounts(false);
        }
      catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while deactivating accounts.");
        }
      }
  }


  useEffect(() => {
    if(showActiveAccounts){
      fetchActiveAccounts();
    }
    if(showInactiveAccounts){
      fetchInactiveAccounts();
    }
  }, [currentPage, itemsPerPage]);


  useEffect(() => {
    resetPagination();
  },[]);

  useEffect(() => {
    resetPagination();
  },[showActiveAccounts, showInactiveAccounts]);

  return (
    <div className='content-area'>
      <AreaTop pageTitle={"Activate Accounts"} pagePath={"Activate-accounts"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className='content-area-form'>
        <div className="admin-form">
      <div className="data-info">
        <h3 className="data-table-title">Make Activate</h3>
      
        <div className="buttons-container">
          <button type="submit" className="form-submit" onClick={fetchActiveAccounts}>Get All Active Accounts</button>
          <button type="submit" className="form-submit" onClick={fetchInactiveAccounts}>Get All Inactive Accounts</button>
        </div>
      </div>
      <div className='activate-form'>
        <form>
          <input type="number" name="accountNumber" value={accountNumber} onChange={(e)=>setAccountNumber(e.target.value)} className="form-input-form" placeholder='Enter Account Number' required/>
          <button type="submit" className="form-submit-form" onClick={handleFormSubmit}>Make Particular Account Activate</button>
        </form>
        <h3 className='or-divider'>OR</h3>
      </div>
      <div className="deactivate-button-container">
        <button type="submit" className="form-submit-deactivation" onClick={handleActivateAccounts}>
          Activate All the Activate who have made the requests
        </button>
      </div>

      {newlyActivated && (
        <div className="deactivate-success">
          { activatedData }
        </div>
      )}

      </div>
      </section>

      {(showActiveAccounts || showInactiveAccounts) && (
        <section className="content-area-table">
          <div className="data-table-info">
          <h3 className="data-table-title">{showActiveAccounts ? 'Active Accounts' : 'Inactive Accounts'}</h3>
          </div>
        <div className="data-table-diagram">
          <Table
              data={data}
              keysToBeIncluded={keysToBeIncluded} 
              includeButton={false}
              handleButtonClick={null}
          />
        </div>
        </section>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  )
}
