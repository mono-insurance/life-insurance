import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { PaginationContext } from '../../../context/PaginationContext';
import { errorToast } from '../../../utils/helper/toast';
import { Table } from '../../../sharedComponents/Table/Table';
import { useParams } from 'react-router-dom';
import { getAllActiveAccounts, makeAccountsInactive } from '../../../services/AdminServices';

export const InactiveAccounts = () => {
  const [newlyDeactivated, setNewlyDeactivated] = useState(false);
  const [deactivatedData, setDeactivatedData] = useState('');
  const [data, setData] = useState([]);
  const [showActiveAccounts, setShowActiveAccounts] = useState(false);
  const [showInactiveAccounts, setShowInactiveAccounts] = useState(false);
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const {currentPage, itemsPerPage, resetPagination} = useContext(PaginationContext);
  const routeParams = useParams();

  const handleDeactivateAccounts = async (e) => {
    e.preventDefault();
    try {

      const response = await makeAccountsInactive();

      console.log(response);
      setDeactivatedData(response);
      setNewlyDeactivated(true);

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
        
        const response = await getAllActiveAccounts(currentPage, itemsPerPage);
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
      <AreaTop pageTitle={"Deactivate Accounts"} pagePath={"Inactive-Accounts"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
      <section className='content-area-form'>
        <div className="admin-form">
      <div className="data-info">
        <h3 className="data-table-title">Make Deactivate</h3>
      
        <div className="buttons-container">
          <button type="submit" className="form-submit" onClick={fetchActiveAccounts}>Get All Active Accounts</button>
          <button type="submit" className="form-submit" onClick={fetchInactiveAccounts}>Get All Inactive Accounts</button>
        </div>
      </div>
      <div className="deactivate-button-container">
        <button type="submit" className="form-submit-deactivation" onClick={(event)=>handleDeactivateAccounts(event)}>
          Deactivate accounts which are not active from last one year
        </button>
      </div>

      {newlyDeactivated && (
        <div className="deactivate-success">
          { deactivatedData }
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
    </div>
  )
}
