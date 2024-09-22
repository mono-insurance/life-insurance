import React, { useState, useEffect, useRef } from 'react';
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
  getApprovedByAgentId, 
  downloadRequestsInPDF,
  downloadRequestsInCSV
} from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './requests.scss';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { fi } from 'date-fns/locale';
import { validateAgentId, validateCustomerId } from '../../../utils/validations/Validations';

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
  const [loading, setLoading] = useState(true);
  const { id: adminId } = useParams();

  const prevCurrentPageRef = useRef(currentPage);
const prevItemsPerPageRef = useRef(itemsPerPage);
  
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

  const handleSearch = () => {
    resetPagination();
    if(filterType === 'byCustomerId' || filterType === 'byAgentId' || filterType === 'withdrawByCustomerId' || filterType === 'withdrawByAgentId' || filterType === 'approvedByCustomerId' || filterType === 'approvedByAgentId'){
      setSearchParams({filterType, id , currentPage, itemsPerPage});
    }
    if(filterType === 'withdraw'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    setShowFilterButton(false);
  }
  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({currentPage: 1, itemsPerPage: 10});
  };

  const fetchData = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
    try {
      let response = {};
      setLoading(true);
      switch (filterTypeFromParams) {
        case 'withdraw':
          response = await getAllWithdrawalRequestsByWithdraw(currentPageFromParams, itemsPerPageFromParams);
          break;
        case 'byCustomerId':
          validateCustomerId(idFromParams);
          response = await getWithdrawalRequestsByCustomerId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'byAgentId':
          validateAgentId(idFromParams);
          response = await getWithdrawalRequestsByAgentId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'withdrawByCustomerId':
          validateCustomerId(idFromParams);
          response = await getWithdrawByCustomerId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'withdrawByAgentId':
          validateAgentId(idFromParams);
          response = await getWithdrawByAgentId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'approvedByCustomerId':
          validateCustomerId(idFromParams);
          response = await getApprovedByCustomerId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'approvedByAgentId':
          validateAgentId(idFromParams);
          response = await getApprovedByAgentId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        default:
          response = await getAllWithdrawalRequests(currentPageFromParams, itemsPerPageFromParams);
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
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterTypeFromParams = searchParams.get('filterType') || '';
    const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;
    const idFromParams = searchParams.get('id') || '';

    if (filterTypeFromParams === 'byCustomerId' || filterTypeFromParams === 'byAgentId' || filterTypeFromParams === 'withdrawByCustomerId' || filterTypeFromParams === 'withdrawByAgentId' || filterTypeFromParams === 'approvedByCustomerId' || filterTypeFromParams === 'approvedByAgentId') {
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
      setId(idFromParams);
    } else if(filterTypeFromParams === 'withdraw'){
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
    }
    else{
      setFilterType('');
      setShowFilterButton(true);
      setShowPagination(true);
    }
    if (currentPageFromParams != prevCurrentPageRef.current || itemsPerPageFromParams != prevItemsPerPageRef.current) {
      prevCurrentPageRef.current = currentPageFromParams;
      prevItemsPerPageRef.current = itemsPerPageFromParams;
      setCurrentPage(currentPageFromParams);
      setItemsPerPage(itemsPerPageFromParams);
    }

    fetchData(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

  }, [searchParams]);

  const handleDownloadRequestsInCSV = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
  
      // Call the function to get the CSV data from the backend
      const response = await downloadRequestsInCSV(); 
      
      // Convert the response data to a Blob (assuming the response is in CSV text format)
      const csvBlob = new Blob([response], { type: 'text/csv' });
  
      // Create a download URL for the CSV blob
      const csvUrl = URL.createObjectURL(csvBlob);
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = csvUrl;
  
      // Set the downloaded file name with the correct .csv extension
      link.setAttribute('download', 'requests.csv');
  
      // Append the link to the body, click it, and then remove it
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  


const handleDownloadRequestsInPDF = async (event) => {
  event.preventDefault();
  try{
    setLoading(true);
    
    const response = await downloadRequestsInPDF();

    const pdfUrl = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'requests.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    
  }catch (error) {
    console.log(error);
    const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
    errorToast(errorMessage);
  }finally{
    setLoading(false);
  }
};


    useEffect(() => {
      if (currentPage != prevCurrentPageRef.current || itemsPerPage != prevItemsPerPageRef.current) {
        prevCurrentPageRef.current = currentPage;
        prevItemsPerPageRef.current = itemsPerPage;
        setSearchParams({
          filterType: searchParams.get('filterType'),
          currentPage: currentPage,
          itemsPerPage: itemsPerPage,
        });
      }

    }, [currentPage, itemsPerPage, setSearchParams, searchParams]);

  const actions = (requestId) => [
    { name: "View/Edit", url: `/suraksha/admin/request/${adminId}/view/${requestId}` }
  ];

  return (
    <>
      <div className='content-area-request'>
      {loading && <Loader />}
        <AreaTop pageTitle={"Get All Withdrawal Requests"} pagePath={"Requests"} pageLink={`/suraksha/admin/dashboard/${adminId}`}/>
        <section className="content-area-table-request">
          <div className="data-table-information">
            <h3 className="data-table-title">Withdrawal Requests</h3>
            <div className="data-table-buttons">
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
              <button className="form-submit-passbook" onClick={handleDownloadRequestsInCSV}>Download (CSV)</button>
              <button className="form-submit-passbook" onClick={handleDownloadRequestsInPDF}>Download (PDF)</button>
            </div>
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
