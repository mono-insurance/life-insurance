import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './claim.scss';
import { ToastContainer } from 'react-toastify';
import { getAllClaims } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';

export const Claim = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();

  const claimTable = async () => {
    try {
        
        const response = await getAllClaims(currentPage, itemsPerPage);
        
        setData(response);
        setKeysToBeIncluded(["withdrawalRequestsId", "requestType", "customerId", "agentId", "amount"]);

    } catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
    }
};


  useEffect(() => {
    claimTable();

  }, [currentPage, itemsPerPage]);
  return (
  <>
      <div className='content-area-claim'>
        <AreaTop pageTitle={"Get All Claims"} pagePath={"Claim"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
        <section className="content-area-table-claim">
          <div className="data-table-information">
            <h3 className="data-table-title">Claim</h3>
          </div>
          <div className="data-table-diagram">
              <Table
                data={data}
                keysToBeIncluded={keysToBeIncluded} 
                includeButton={false}
                handleButtonClick={null}
                currentPage={currentPage}
                pageSize={itemsPerPage}
                setPage={setCurrentPage}
                setPageSize={setItemsPerPage}
              />
          </div>
          <h3 className='data-table-body'>Total Balance: {data.totalBalance}</h3>
        </section>
        
      </div>
      <ToastContainer position="bottom-right"/>
    </>
  )
}
