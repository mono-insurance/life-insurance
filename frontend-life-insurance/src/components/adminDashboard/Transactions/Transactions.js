import React, { useContext, useEffect, useRef, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { PaginationContext } from '../../../context/PaginationContext';
import { Table } from '../../../sharedComponents/Table/Table';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './transactions.scss';
import { errorToast } from '../../../utils/helper/toast';
import { addDays } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { getAllTransactions, getAllTransactionsByAccountNumber, getAllTransactionsByDate } from '../../../services/AdminServices';
import { formatDateForTable, formatDateTimeForBackend } from '../../../services/SharedServices';
import { useParams, useSearchParams } from 'react-router-dom';
import { validateAccountNumber } from '../../../utils/validations/Validations';
import { ToastContainer } from 'react-toastify';

export const Transactions = () => {
  const {currentPage, itemsPerPage, resetPagination, handleItemsPerPageChange, handlePageChange} = useContext(PaginationContext);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);
  const routeParams = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = [
    { label: 'Search by Date', value: 'date' },
    { label: 'Search by Account Number', value: 'accountNumber' }
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

  const handleSearch = () => {
    resetPagination();
    if(filterType === 'accountNumber'){
      setSearchParams({filterType, accountNumber, currentPage, itemsPerPage});
    }
    if(filterType === 'date'){
      setSearchParams({filterType, startDate: state[0].startDate,enddate: state[0].endDate, currentPage, itemsPerPage});
    }
    if(filter === false) {
      setFilter(true);
    }
    else{
      transactionTable();
    }
  }
  
  const handleReset = () => {
    setFilterType('');
    setAccountNumber('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setSearchParams({});
  };

  const handleInputClick = () => {
    setShowDatePicker(true);
  };


  const transactionTable = async () => {
      try {
          let response = {}; 
          let formattedData = [];
          if(filterType === 'accountNumber') {
            validateAccountNumber(accountNumber);
            response = await getAllTransactionsByAccountNumber(currentPage, itemsPerPage, accountNumber);
            formattedData = formatDateForTable(response);
          }

          else if(filterType === 'date') {

            const startDate = formatDateTimeForBackend(state[0].startDate, true);
            const endDate = formatDateTimeForBackend(state[0].endDate, false);

            response = await getAllTransactionsByDate(currentPage, itemsPerPage, startDate, endDate);
            formattedData = formatDateForTable(response);
          }

          else {
            response = await getAllTransactions(currentPage, itemsPerPage);
            formattedData = formatDateForTable(response);
          }
          
          setData({
            content: formattedData,
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last
          });
          setKeysToBeIncluded(["id", "senderAccountNumber", "receiverAccountNumber", "transactionType",  "amount", "transactionDate"]);

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
      const filterTypeParam = searchParams.get('filterType') || '';
      const startDateParam = searchParams.get('startDate') || '';
      const endDateParam = searchParams.get('endDate') || '';
      const accountNumberParam = searchParams.get('accountNumber') || '';
      const currentPageParam = Number(searchParams.get('currentPage')) || 1;
      const itemsPerPageParam = Number(searchParams.get('itemsPerPage')) || 10;

      if (filterTypeParam === 'date' || filterTypeParam === 'accountNumber') {
        setFilterType(filterTypeParam);
        setShowFilterButton(!filterTypeParam);
        setFilter(true);
        if (filterTypeParam === 'accountNumber') {
          setAccountNumber(accountNumberParam);
        } else if (filterTypeParam === 'date') {
          setState([
            {
              startDate: new Date(startDateParam),
              endDate: new Date(endDateParam),
              key: "selection",
            },
          ]);
        }
        handlePageChange(currentPageParam);
        handleItemsPerPageChange(itemsPerPageParam);
      } else {
        setShowFilterButton(true);
        setAccountNumber('');
        setFilterType('');
        setFilter(false);
        resetPagination();
      }
    },[searchParams]);


    useEffect(() => {
      const hasSearchParams = searchParams.toString() !== '';

      if(!hasSearchParams) {
        setShowFilterButton(true);
        setAccountNumber('');
        setFilterType('');
        setFilter(false);
        resetPagination();
      }
      
      const timeoutId = setTimeout(() => {
        transactionTable();
      }, hasSearchParams ? 0: 0);
      return () => clearTimeout(timeoutId);

    }, [filter, currentPage, itemsPerPage, searchParams]);


    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    


  return (
  <>
  <div className='content-area'>
    <AreaTop pageTitle={"Get All Transactions"} pagePath={"Transactions"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
    <section className="content-area-table">
      <div className="data-table-part">
        <h3 className="data-table-title">Transactions</h3>
        {showFilterButton && (
          <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
        )}
        {(filterType === 'accountNumber' || filterType === 'date') && (
          <div className="filter-container">
            {filterType === 'accountNumber' && (
              <div className="filter">
                <input type="number" placeholder="Enter Account Number" className="form-input" name={accountNumber} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}/>
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
    <ToastContainer position="bottom-right" />
  </div>
  </>
    
  )
}

