import React, { useContext, useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './getRequests.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { getAllApprovedRequestsByCustomer, updateWithdrawRequestToTrue } from '../../../services/CustomerServices';
import { Pagination } from '../../../sharedComponents/Table/Pagination/Pagination';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const GetRequests = () => {
  const {customerId} = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);


  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllApprovedRequestsByCustomer(currentPage, itemsPerPage, customerId);
      console.log(response);
      setData(response);

    } catch (error) {
      setData([]);
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred. Please try again later.");
      }
    }finally{
      setLoading(false);
    }
  };

  const handleWithdrawClick = async (withdrawalId) => {
    try {
      setLoading(true);
      await updateWithdrawRequestToTrue(withdrawalId);

      successToast("Request withdrawn successfully!");

      fetchRequests();
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

  useEffect(() => {
    if(customerId){
      fetchRequests();
    }
  }, [currentPage, itemsPerPage, searchParams]);

  return (
    <>
      <div className='content-area-request'>
        {loading && <Loader />}
        <AreaTop pageTitle={"Get Approved Requests"} pagePath={"Requests"} pageLink={`/suraksha/insurances`} />
        <section className="content-area-list-request">
          <div className="data-table-information">
            <h3 className="data-table-title">All Approved Requests</h3>
          </div>
          <div className="request-list">
            {data && data.content && data.content.length > 0 ? (
              <>
                {data.content.map((request, index) => (
                  <div key={index} className="request-item border-gray-100 shadow-lg">
                    <div className="request-text">
                      <p className="request-id"><strong>Request Type:</strong> {request.requestType}</p>
                      <p className="amount"><strong>Amount:</strong> {request.amount}</p>
                      <p className="status"><strong>Policy Account Id:</strong> {request.policyAccountId}</p>
                    </div>
                    <div className="request-action">
                      {request.isWithdraw ? (
                        <p className="withdraw-status">Withdrawn</p>
                      ) : (
                        <button className="withdraw-button" onClick={()=>handleWithdrawClick(request.withdrawalRequestsId)}>Withdraw</button>
                      )}
                    </div>
                  </div>
                ))}

                {showPagination && (
                  <Pagination
                    noOfPages={data.totalPages}
                    noOfElements={data.totalElements}
                    currentPage={currentPage}
                    pageSize={itemsPerPage}
                    setPage={setCurrentPage}
                    setPageSize={setItemsPerPage}
                  />
                )}
              </>
            ) : (
              <div>No approved requests found.</div>
            )}
          </div>
        </section>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};
