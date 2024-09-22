import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getEmployees.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAllActiveEmployees, getAllEmployees, getAllInactiveEmployees, getEmployeeById } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../utils/helper/helperFunctions';
import { validateCustomerId, validateFirstName } from '../../../utils/validations/Validations';

export const GetEmployees = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [id, setId] = useState('');
  const [active, setActive] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: adminId } = useParams();
  const filterOptions = [
    { label: 'Search by Employee Id', value: 'id' },
    { label: 'Search by Active', value: 'active' },
    { label: 'Search by Inactive', value: 'inactive' }
];

const resetPagination = () => {
  setCurrentPage(1);
  setItemsPerPage(10);
};

  const handleSearch = () => {
    resetPagination();
    if(filterType === 'id'){
      setSearchParams({filterType, id});
      setShowPagination(false);
    }
    if(filterType === 'active'){
      setSearchParams({filterType, active, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    if(filterType === 'inactive'){
      setSearchParams({filterType, active, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    if(filter === false) {
      setFilter(true);
    }
    else{
      employeeTable();
    }
  }
  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setActive('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const actions = (employeeId) => [
    { name: "Edit", url: `/admin/employee/${adminId}/edit/${employeeId}` },
    { name: "Delete", url: `/admin/employee/${adminId}/delete/${employeeId}` }
  ];
  


    const employeeTable = async () => {
      try {
          let response = {};

          if(filterType === 'active') {
            response = await getAllActiveEmployees(currentPage, itemsPerPage);
          }
          else if(filterType === 'inactive') {
            response = await getAllInactiveEmployees(currentPage, itemsPerPage);
          }
          else if(filterType === 'id') {
            validateCustomerId(id);
            const data = await getEmployeeById(id);
            response = covertIdDataIntoTable(data);
          }
          else {
            response = await getAllEmployees(currentPage, itemsPerPage);
          }
          
          setData(response);
          setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "mobileNumber", "isActive", "dateOfBirth", "qualification"]);

      } catch (error) {
          setData([]);
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
      }
  };



    // useEffect(() => {
    //   const filterTypeParam = searchParams.get('filterType') || '';
    //   const idParam = searchParams.get('id') || '';
    //   const firstNameParam = searchParams.get('firstName') || '';
    //   const currentPageParam = Number(searchParams.get('currentPage')) || 1;
    //   const itemsPerPageParam = Number(searchParams.get('itemsPerPage')) || 10;
    //   console.log(filterTypeParam, idParam, firstNameParam, currentPageParam, itemsPerPageParam);
    //   if (filterTypeParam === 'id' || filterTypeParam === 'firstName') {
    //     setFilterType(filterTypeParam);
    //     setShowFilterButton(!filterTypeParam);
    //     setFilter(true);
    //     if (filterTypeParam === 'firstName') {
    //       setFirstName(firstNameParam);
    //       handlePageChange(currentPageParam);
    //       handleItemsPerPageChange(itemsPerPageParam);
    //     } else if (filterTypeParam === 'id') {
    //       setId(idParam);
    //       setShowPagination(false);
    //       resetPagination();
    //     }
    //   } else {
    //     setShowFilterButton(true);
    //     setId('');
    //     setFirstName('');
    //     setFilterType('');
    //     setFilter(false);
    //     setShowPagination(true);
    //     resetPagination();
    //   }
    // },[searchParams]);


    useEffect(() => {
      // const hasSearchParams = searchParams.toString() !== '';

      // if(!hasSearchParams) {
      //   setShowFilterButton(true);
      //   setId('');
      //   setFirstName('');
      //   setFilterType('');
      //   setFilter(false);
      //   setShowPagination(true);
      // }
      
      // const timeoutId = setTimeout(() => {
      //   customerTable();
      // }, hasSearchParams ? 0: 0);
      // return () => clearTimeout(timeoutId);
      employeeTable();

    }, [filter, currentPage, itemsPerPage, searchParams]);


  return (
    <>
        <div className='content-area-employees'>
          <AreaTop pageTitle={"Get All Employees"} pagePath={"Employees"} pageLink={`/admin/dashboard/${routeParams.id}`}/>
          <section className="content-area-table-employees">
            <div className="data-table-information">
              <h3 className="data-table-title">Employees</h3>
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'active' ||  filterType === 'inactive' || filterType === 'id') && (
                  <div className="filter-container">
                    {filterType === 'id' && (
                      <div className="filter">
                          <input type="number" placeholder="Enter Employee Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
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
  )
}
