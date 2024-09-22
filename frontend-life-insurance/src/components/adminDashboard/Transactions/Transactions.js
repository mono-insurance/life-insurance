import React from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { Table } from '../../../sharedComponents/Table/Table'
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton'
import { errorToast } from '../../../utils/helper/toast'
import { addDays } from "date-fns"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { downloadTransactionsByIdInPDF, downloadTransactionsInCSV, downloadTransactionsInPDF, getAllTransactions, getAllTransactionsByCustomerId, getAllTransactionsByDate, getAllTransactionsByPolicyAccountId } from '../../../services/AdminServices'
import { formatDateTimeForBackend } from '../../../utils/helper/helperFunctions'
import { useParams, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useState, useEffect, useRef } from 'react'
import './transactions.scss'
import { Loader } from '../../../sharedComponents/Loader/Loader'
import { validateCustomer } from '../../../services/AuthServices'
import { validateCustomerId, validatePolicyAccountId } from '../../../utils/validations/Validations'

export const Transactions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState('');
  const routeParams = useParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { label: 'By Customer Id', value: 'byCustomerId' },
    { label: 'By Date', value: 'date' },
    { label: 'By PolicyAccount Id', value: 'policyAccountId' }
  ];

  const [state, setState] = useState([
    {
      startDate: addDays(new Date(), - 7),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  const handleInputClick = () => {
    setShowDatePicker(true);
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = async () => {
    resetPagination();
    if(filterType === 'policyAccountId' || filterType === 'byCustomerId'){
      setSearchParams({filterType, id, currentPage, itemsPerPage});
    }
    if(filterType === 'date'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    setShowFilterButton(false);
  };

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setSearchParams({currentPage: 1, itemsPerPage: 10});
  };

  const fetchData = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
    try {
      let response = {};
      setLoading(true);
      switch (filterTypeFromParams) {
        case 'date':
          const startDate = formatDateTimeForBackend(state[0].startDate, true);
          const endDate = formatDateTimeForBackend(state[0].endDate, false);

          response = await getAllTransactionsByDate(currentPageFromParams, itemsPerPageFromParams, startDate, endDate);
          break;
        case 'byCustomerId':
          validateCustomerId(idFromParams);
          response = await getAllTransactionsByCustomerId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        case 'policyAccountId':
          validatePolicyAccountId(idFromParams);
          response = await getAllTransactionsByPolicyAccountId(currentPageFromParams, itemsPerPageFromParams, idFromParams);
          break;
        default:
          response = await getAllTransactions(currentPageFromParams, itemsPerPageFromParams);
      }
      setData(response);
      setKeysToBeIncluded(["transactionId", "transactionDate", "amount", "status", "policyAccountId"]);
    } catch (error) {
      setData([]);
      console.error(error);
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred. Please try again later.");
      }
    }finally{
      setLoading(false);
    }
  };

  const prevCurrentPageRef = useRef(currentPage);
const prevItemsPerPageRef = useRef(itemsPerPage);

useEffect(() => {
  const filterTypeFromParams = searchParams.get('filterType') || '';
  const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
  const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;
  const idFromParams = searchParams.get('id') || '';

  if (filterTypeFromParams === 'byCustomerId' || filterTypeFromParams === 'policyAccountId') {
    setFilterType(filterTypeFromParams);
    setShowFilterButton(false);
    setId(idFromParams);
  } else if(filterTypeFromParams === 'date'){
    setFilterType(filterTypeFromParams);
    setShowFilterButton(false);
  }
  else{
    setFilterType('');
    setShowFilterButton(true);
  }
  if (currentPageFromParams != prevCurrentPageRef.current || itemsPerPageFromParams != prevItemsPerPageRef.current) {
    prevCurrentPageRef.current = currentPageFromParams;
    prevItemsPerPageRef.current = itemsPerPageFromParams;
    setCurrentPage(currentPageFromParams);
    setItemsPerPage(itemsPerPageFromParams);
  }

  fetchData(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

}, [searchParams]);


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


const handleDownloadTransactionsInCSV = async (event) => {
  event.preventDefault();
  try {
    setLoading(true);

    // Call the function to get the CSV data from the backend
    const response = await downloadTransactionsInCSV(); 
    
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



const handleDownloadTransactionsInPDF = async (event) => {
event.preventDefault();
try{
  setLoading(true);
  let response = {};
  if(filterType === 'policyAccountId'){
    validatePolicyAccountId(id);
    response = await downloadTransactionsByIdInPDF(id);
  }else{
    response = await downloadTransactionsInPDF();
  }

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


  return (
    <>
    <div className='content-area-transactions'>
    {loading && <Loader />}
      <AreaTop pageTitle={"Get All Transactions"} pagePath={"Transactions"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
      <section className="content-area-table-transactions">
        <div className="data-table-information">
          <h3 className="data-table-title">Transactions</h3>
          <div className="data-table-buttons">
          {showFilterButton && (
            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
          )}
          {(filterType === 'policyAccountId' || filterType === 'date' || filterType === 'byCustomerId') && (
            <div className="filter-container">
              {(filterType === 'policyAccountId' || filterType === 'byCustomerId') && (
                <div className="filter">
                  <input type="number" placeholder={ filterType === 'byCustomerId' ? "Enter Customer Id": "Enter Account Number"} className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
                </div>
              )}
              {filterType === 'date' && (
                <div className="filter">
                  <div ref={dateRangeRef} className={`date-range-wrapper ${ !showDatePicker ? "hide-date-range" : ""}`} onClick={handleInputClick}>
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setState([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={state}
                      showMonthAndYearPickers={false}
                    />
                  </div>
                </div>
              )}
              <div className="filter-buttons">
                <button className="form-submit-b" onClick={handleSearch}>Search</button>
                <button className="form-submit-b" onClick={handleReset}>Clear</button>
              </div>
            </div>
          )}
              <button className="form-submit-passbook" onClick={handleDownloadTransactionsInCSV}>Download (CSV)</button>
              <button className="form-submit-passbook" onClick={handleDownloadTransactionsInPDF}>Download (PDF)</button>
          </div>
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
      </section>
      <ToastContainer position="bottom-right" />
    </div>
    </>
  )
}
