import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { errorToast, successToast } from '../../../utils/helper/toast';
import { NotFoundError } from '../../../utils/errors/APIError';
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import './activateCustomers.scss'
import { useParams } from 'react-router-dom';
import { activateParticularCustomer, getAllActiveCustomers, getAllInactiveCustomers, makeAllRequestsCustomerActivate } from '../../../services/AdminServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

export const ActivateCustomers = () => {
  const [newlyActivated, setNewlyActivated] = useState(false);
  const [activatedData, setActivatedData] = useState('');
  const [data, setData] = useState([]);
  const [showActiveCustomers, setShowActiveCustomers] = useState(false);
  const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const {currentPage, itemsPerPage, resetPagination} = useContext(PaginationContext);
  const [customerId, setCustomerId] = useState('');
  const routeParams = useParams();


  const handleFormSubmit = async(e) => {
    e.preventDefault();
    try {
      validateCustomerId(customerId);

      await activateParticularCustomer(customerId);

      successToast("Customer has been activated successfully!");
      setCustomerId('');
    } 
    catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An error occurred while Activating customer.");
      }
    }
  }

  const handleActivateCustomers = async (e) => {
    e.preventDefault();
    try {

      const response = await makeAllRequestsCustomerActivate();

      console.log(response);
      setActivatedData(response);
      setNewlyActivated(true);

    } 
    catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An error occurred while Activating customers.");
      }
    }
  };


  const fetchActiveCustomers = async () => {
    try {
        const response = await getAllActiveCustomers(currentPage, itemsPerPage);
        setData(response);

        setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "active", "totalBalance"]);
        setShowActiveCustomers(true);
        setShowInactiveCustomers(false);
      }
      catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while Activating customers.");
        }
      }
  }

  const fetchInactiveCustomers = async () => {
    try {
        const response = await getAllInactiveCustomers(currentPage, itemsPerPage);
        setData(response.data);

        setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "active", "totalBalance"]);
        setShowInactiveCustomers(true);
        setShowActiveCustomers(false);
        }
      catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while Activating customers.");
        }
      }
  }


  useEffect(() => {
    if(showActiveCustomers){
      fetchActiveCustomers();
    }
    if(showInactiveCustomers){
      fetchInactiveCustomers();
    }
  }, [currentPage, itemsPerPage]);


  useEffect(() => {
    resetPagination();
  },[]);

  useEffect(() => {
    resetPagination();
  },[showActiveCustomers, showInactiveCustomers]);

  return (
    <div className='content-area'>
      <AreaTop pageTitle={"Activate Customers"} pagePath={"Activate-Customers"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className='content-area-form'>
        <div className="admin-form">
      <div className="data-info">
        <h3 className="data-table-title">Make Activate</h3>
      
        <div className="buttons-container">
          <button type="submit" className="form-submit" onClick={fetchActiveCustomers}>Get All Active Customers</button>
          <button type="submit" className="form-submit" onClick={fetchInactiveCustomers}>Get All Inactive Customers</button>
        </div>
      </div>
      <div className='activate-form'>
        <form>
          <input type="number" name="customerId" value={customerId} onChange={(e)=>setCustomerId(e.target.value)} className="form-input-form" placeholder='Enter Customer ID' required/>
          <button type="submit" className="form-submit-form" onClick={(event)=>handleFormSubmit(event)}>Make Particular Customer Activate</button>
        </form>
        <h3 className='or-divider'>OR</h3>
      </div>
      <div className="deactivate-button-container">
        <button type="submit" className="form-submit-deactivation" onClick={(event)=>handleActivateCustomers(event)}>
          Activate All the Customers who have made the requests
        </button>
      </div>

      {newlyActivated && (
        <div className="deactivate-success">
          { activatedData }
        </div>
      )}

      </div>
      </section>

      {(showActiveCustomers || showInactiveCustomers) && (
        <section className="content-area-table">
          <div className="data-table-info">
          <h3 className="data-table-title">{showActiveCustomers ? 'Active Customers' : 'Inactive Customers'}</h3>
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
