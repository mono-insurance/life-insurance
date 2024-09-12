import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './customer.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { deleteUser, getAllCustomers, getAllCustomersByCharacters, getCustomerById } from '../../../services/AdminServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../services/SharedServices';
import { validateCustomerId, validateFirstName } from '../../../utils/validations/Validations';

export const Customer = () => {
  const {currentPage, itemsPerPage, resetPagination, handleItemsPerPageChange, handlePageChange} = useContext(PaginationContext);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = [
    { label: 'Search by Customer Id', value: 'id' },
    { label: 'Search by Characters', value: 'firstName' }
];
  const handleSearch = () => {
    resetPagination();
    if(filterType === 'id'){
      setSearchParams({filterType, id});
      setShowPagination(false);
    }
    if(filterType === 'firstName'){
      setSearchParams({filterType, firstName, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    if(filter === false) {
      setFilter(true);
    }
    else{
      customerTable();
    }
  }
  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setFirstName('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const handleButtonClick = async (item) => {
    try{
        await deleteUser(item.id);
        customerTable();
        successToast("Customer deleted successfully");
    }
    catch(error){
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast("An unexpected error occurred while deleting. Please try again later.");
      }
    }
};


    const customerTable = async () => {
      try {
          let response = {};
          console.log(firstName)
          if(filterType === 'firstName') {
            validateFirstName(firstName);
            response = await getAllCustomersByCharacters(currentPage, itemsPerPage, firstName);
          }
          else if(filterType === 'id') {
            validateCustomerId(id);
            const data = await getCustomerById(id);
            response = covertIdDataIntoTable(data);
          }
          else {
            response = await getAllCustomers(currentPage, itemsPerPage);
          }
          
          setData(response);
          setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "active"]);

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
      const idParam = searchParams.get('id') || '';
      const firstNameParam = searchParams.get('firstName') || '';
      const currentPageParam = Number(searchParams.get('currentPage')) || 1;
      const itemsPerPageParam = Number(searchParams.get('itemsPerPage')) || 10;
      console.log(filterTypeParam, idParam, firstNameParam, currentPageParam, itemsPerPageParam);
      if (filterTypeParam === 'id' || filterTypeParam === 'firstName') {
        setFilterType(filterTypeParam);
        setShowFilterButton(!filterTypeParam);
        setFilter(true);
        if (filterTypeParam === 'firstName') {
          setFirstName(firstNameParam);
          handlePageChange(currentPageParam);
          handleItemsPerPageChange(itemsPerPageParam);
        } else if (filterTypeParam === 'id') {
          setId(idParam);
          setShowPagination(false);
          resetPagination();
        }
      } else {
        setShowFilterButton(true);
        setId('');
        setFirstName('');
        setFilterType('');
        setFilter(false);
        setShowPagination(true);
        resetPagination();
      }
    },[searchParams]);


    useEffect(() => {
      const hasSearchParams = searchParams.toString() !== '';

      if(!hasSearchParams) {
        setShowFilterButton(true);
        setId('');
        setFirstName('');
        setFilterType('');
        setFilter(false);
        setShowPagination(true);
        resetPagination();
      }
      
      const timeoutId = setTimeout(() => {
        customerTable();
      }, hasSearchParams ? 0: 0);
      return () => clearTimeout(timeoutId);

    }, [filter, currentPage, itemsPerPage, searchParams]);

  return (
  <>
  <div className='content-area'>
    <AreaTop pageTitle={"Get All Customers"} pagePath={"Customer"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
    <section className="content-area-table">
      <div className="data-table-information">
        <h3 className="data-table-title">Customers</h3>
          {showFilterButton && (
            <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
          )}
          {(filterType === 'firstName' || filterType === 'id') && (
            <div className="filter-container">
              {filterType === 'firstName' && (
                <div className="filter">
                  <input type="text" placeholder="Enter Characters" className="form-input" name={firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
              )}
              {filterType === 'id' && (
                <div className="filter">
                    <input type="number" placeholder="Enter Customer Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
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
            handleButtonClick={handleButtonClick}
            showPagination={showPagination}
          />
      </div>
    </section>
    
  </div>
  <ToastContainer position="bottom-right"/>
  </>
    
  )
}