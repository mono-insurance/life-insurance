import React, { useContext, useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { PaginationContext } from '../../../context/PaginationContext';
import './getRequests.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAllApprovedRequestsByCustomer } from '../../../services/CustomerServices';
import { Pagination } from '../../../sharedComponents/Table/Pagination/Pagination';

export const GetRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const routeParams = useParams();
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();


  const fetchRequests = async () => {
    try {

      const response = await getAllApprovedRequestsByCustomer(currentPage, itemsPerPage, routeParams.id);
      console.log(response);
      setData(response);

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
    fetchRequests();
  }, [currentPage, itemsPerPage, searchParams]);

  return (
    <>
      <div className='content-area-request'>
        <AreaTop pageTitle={"Get Approved Requests"} pagePath={"Requests"} pageLink={`/customer/policy-account/${routeParams.id}`} />
        <section className="content-area-list-request">
          <div className="data-table-information">
            <h3 className="data-table-title">All Approved Requests</h3>
          </div>
          <div className="request-list">
            {data && data.content && data.content.length > 0 ? (
              <>
                {data.content.map((request, index) => (
                  <div key={index} className="request-item">
                    <div className="request-text">
                      <p className="request-id"><strong>Request Type:</strong> {request.requestType}</p>
                      <p className="amount"><strong>Amount:</strong> {request.amount}</p>
                      <p className="status"><strong>Policy Account Id:</strong> {request.policyAccountId}</p>
                    </div>
                    <div className="request-action">
                      {request.isWithdraw ? (
                        <p className="withdraw-status">Withdrawn</p>
                      ) : (
                        <button className="withdraw-button">Withdraw</button>
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
