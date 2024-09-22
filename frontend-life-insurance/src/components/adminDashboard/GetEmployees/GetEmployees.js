import React, { useRef } from 'react'
import { useState, useEffect, useContext } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getEmployees.scss';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAllActiveEmployees, getAllEmployees, getAllInactiveEmployees, getEmployeeById } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../utils/helper/helperFunctions';
import { validateCustomerId, validateEmployeeId, validateFirstName } from '../../../utils/validations/Validations';
import { set } from 'date-fns';
import { Loader } from '../../../sharedComponents/Loader/Loader';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { label: 'Search by Employee Id', value: 'id' },
    { label: 'Search by Active', value: 'active' },
    { label: 'Search by Inactive', value: 'inactive' }
];

const prevCurrentPageRef = useRef(currentPage);
const prevItemsPerPageRef = useRef(itemsPerPage);

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
      setSearchParams({filterType, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    if(filterType === 'inactive'){
      setSearchParams({filterType, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    setShowFilterButton(false);
  }
  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setActive('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({currentPage: 1, itemsPerPage: 10});
  };

  const actions = (employeeId) => [
    { name: "Edit", url: `/suraksha/admin/employee/${adminId}/edit/${employeeId}` },
    { name: "Delete", url: `/suraksha/admin/employee/${adminId}/delete/${employeeId}` }
  ];
  

    const employeeTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
      try {
          let response = {};
          setLoading(true);

          if(filterTypeFromParams === 'active') {
            response = await getAllActiveEmployees(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'inactive') {
            response = await getAllInactiveEmployees(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'id') {
            validateEmployeeId(idFromParams);
            const data = await getEmployeeById(idFromParams);
            response = covertIdDataIntoTable(data);
          }
          else {
            response = await getAllEmployees(currentPageFromParams, itemsPerPageFromParams);
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
      }finally{
        setLoading(false);
      }
  };



  useEffect(() => {
    const filterTypeFromParams = searchParams.get('filterType') || '';
    const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;
    const idFromParams = searchParams.get('id') || '';

    if (filterTypeFromParams === 'active' || filterTypeFromParams === 'inactive' ) {
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
    } else if(filterTypeFromParams === 'id'){
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(false);
      setId(idFromParams);
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

    employeeTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

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


  return (
    <>
        <div className='content-area-employees'>
        {loading && <Loader />}
        <div className='flex justify-between'>
       
        <AreaTop pageTitle={"Get All Employees"} pagePath={"Employees"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
          <button type="button" className="form-submit-b rounded-full" onClick={()=> navigate(`/suraksha/admin/add-employees/${routeParams.id}`)}>
              Add Employee
          </button>
        </div>
          
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
