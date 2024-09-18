import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  getAllWithdrawalRequests, 
  getAllWithdrawalRequestsByWithdraw, 
  getWithdrawalRequestsByCustomerId, 
  getWithdrawalRequestsByAgentId, 
  getWithdrawByCustomerId, 
  getWithdrawByAgentId, 
  getApprovedByCustomerId, 
  getApprovedByAgentId 
} from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './requests.scss';

export const Requests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState('');
  const { id: adminId } = useParams();
  
  const filterOptions = [
    { label: 'Withdrawn', value: 'withdraw' },
    { label: 'By Customer ID', value: 'byCustomerId' },
    { label: 'By Agent ID', value: 'byAgentId' },
    { label: 'Withdraw by Customer ID', value: 'withdrawByCustomerId' },
    { label: 'Withdraw by Agent ID', value: 'withdrawByAgentId' },
    { label: 'Approved by Customer ID', value: 'approvedByCustomerId' },
    { label: 'Approved by Agent ID', value: 'approvedByAgentId' }
  ];

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = async () => {
    resetPagination();
    setShowPagination(true);
    setFilter(true);
    await fetchData();
  };

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const fetchData = async () => {
    try {
      let response = {};

      switch (filterType) {
        case 'withdraw':
          response = await getAllWithdrawalRequestsByWithdraw(currentPage, itemsPerPage);
          break;
        case 'byCustomerId':
          response = await getWithdrawalRequestsByCustomerId(currentPage, itemsPerPage, id);
          break;
        case 'byAgentId':
          response = await getWithdrawalRequestsByAgentId(currentPage, itemsPerPage, id);
          break;
        case 'withdrawByCustomerId':
          response = await getWithdrawByCustomerId(currentPage, itemsPerPage, id);
          break;
        case 'withdrawByAgentId':
          response = await getWithdrawByAgentId(currentPage, itemsPerPage, id);
          break;
        case 'approvedByCustomerId':
          response = await getApprovedByCustomerId(currentPage, itemsPerPage, id);
          break;
        case 'approvedByAgentId':
          response = await getApprovedByAgentId(currentPage, itemsPerPage, id);
          break;
        default:
          response = await getAllWithdrawalRequests(currentPage, itemsPerPage);
      }
      const transformedData = response.content.map(item => ({
        requestsId: item.withdrawalRequestsId,
        requestType: item.requestType,
        amount: item.amount,
        isApproved: item.isApproved,
        isWithdraw: item.isWithdraw,
        policyAccountId: item.policyAccountId,
        customerId: item.customerId,
        agentId: item.agentId,
      }));
  
      setData({
        content: transformedData,
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        last: response.last
      });
      setKeysToBeIncluded(["requestsId", "requestType", "amount", "isApproved", "isWithdraw", "policyAccountId", "customerId", "agentId"]);
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
    fetchData();
  }, [filter, currentPage, itemsPerPage, searchParams]);

  const actions = (requestId) => [
    { name: "View/Edit", url: `/admin/request/${adminId}/view/${requestId}` }
  ];

  return (
    <>
      <div className='content-area-request'>
        <AreaTop pageTitle={"Get All Withdrawal Requests"} pagePath={"Requests"} pageLink={`/admin/dashboard/${adminId}`}/>
        <section className="content-area-table-request">
          <div className="data-table-information">
            <h3 className="data-table-title">Withdrawal Requests</h3>
              {showFilterButton && (
                <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
              )}
              {filterType && (
                <div className="filter-container">
                  {(filterType.includes('CustomerId') || filterType.includes('AgentId')) && (
                    <div className="filter">
                      <input type="number" placeholder={filterType.includes('AgentId') ? "Enter Agent Id" : "Enter Customer Id"} className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
                    </div>
                  )}
                  <div className="filter-buttons">
                    <button className="form-submit-b" onClick={handleSearch}>Search</button>
                    <button className="form-submit-b" onClick={handleReset}>Clear</button>
                  </div>
                </div>
              )}
          </div>
          <div className="data-table-diagram">
              <Table
                data={data}
                keysToBeIncluded={keysToBeIncluded} 
                includeButton={true}
                handleButtonClick={actions}
                showPagination={showPagination}
                currentPage={currentPage}
                pageSize={itemsPerPage}
                setPage={setCurrentPage}
                setPageSize={setItemsPerPage}
              />
          </div>
        </section>
        
      </div>
      <ToastContainer position="bottom-right"/>
    </>
  );
};
