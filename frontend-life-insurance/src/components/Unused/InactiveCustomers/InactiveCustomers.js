import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import axios from 'axios';
import { AxiosError } from '../../../utils/errors/APIError';
import { errorToast } from '../../../utils/helper/toast';
import { Table } from '../../../sharedComponents/Table/Table';
import './inactiveCustomers.scss'; 
import { PaginationContext } from '../../../context/PaginationContext';
import { useParams } from 'react-router-dom';
import { getAllActiveCustomers, getAllInactiveCustomers, makeCustomersInactive } from '../../../services/AdminServices';

export const InactiveCustomers = () => {
  const [newlyDeactivated, setNewlyDeactivated] = useState(false);
  const [deactivatedData, setDeactivatedData] = useState('');
  const [data, setData] = useState([]);
  const [showActiveCustomers, setShowActiveCustomers] = useState(false);
  const [showInactiveCustomers, setShowInactiveCustomers] = useState(false);
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const token = localStorage.getItem("auth");
  const {currentPage, itemsPerPage, resetPagination} = useContext(PaginationContext);
  const routeParams = useParams();

  const handleDeactivateCustomers = async (e) => {
    e.preventDefault();
    try {

      const response = await makeCustomersInactive();

      console.log(response);
      setDeactivatedData(response);
      setNewlyDeactivated(true);

    } 
    catch (error) {
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An error occurred while deactivating customers.");
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
          errorToast("An error occurred while deactivating customers.");
        }
      }
  }

  const fetchInactiveCustomers = async () => {
    try {
        const response = await getAllInactiveCustomers(currentPage, itemsPerPage);
        setData(response);

        setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "active", "totalBalance"]);
        setShowInactiveCustomers(true);
        setShowActiveCustomers(false);
      }
      catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
          errorToast("An error occurred while deactivating customers.");
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
      <AreaTop pageTitle={"Deactivate Customers"} pagePath={"Inactive-Customers"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className='content-area-form'>
        <div className="admin-form">
      <div className="data-info">
        <h3 className="data-table-title">Make Deactivate</h3>
      
        <div className="buttons-container">
          <button type="submit" className="form-submit" onClick={fetchActiveCustomers}>Get All Active Customers</button>
          <button type="submit" className="form-submit" onClick={fetchInactiveCustomers}>Get All Inactive Customers</button>
        </div>
      </div>
      <div className="deactivate-button-container">
        <button type="submit" className="form-submit-deactivation" onClick={(event)=>handleDeactivateCustomers(event)}>
          Deactivate customers who are not active from last one year
        </button>
      </div>

      {newlyDeactivated && (
        <div className="deactivate-success">
          { deactivatedData }
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
    </div>
  )
}
