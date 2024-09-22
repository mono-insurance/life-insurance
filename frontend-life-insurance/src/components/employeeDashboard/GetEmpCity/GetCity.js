import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getCity.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAllActiveCities, getAllCities, getAllInactiveCities } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';


export const GetEmpCity = () => {


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [active, setActive] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: employeeId } = useParams();
  const filterOptions = [
    { label: 'Search by Active', value: 'active' },
    { label: 'Search by Inactive', value: 'inactive' }
  ];

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = () => {
    resetPagination();
    if (filterType === 'active') {
      setSearchParams({ filterType, active, currentPage, itemsPerPage });
      setShowPagination(true);
    }
    if (filterType === 'inactive') {
      setSearchParams({ filterType, active, currentPage, itemsPerPage });
      setShowPagination(true);
    }
    if (filter === false) {
      setFilter(true);
    }
    else {
      cityTable();
    }
  }

  const handleReset = () => {
    setFilterType('');
    setActive('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const actions = (cityId) => [
    { name: "Edit", url: `/employee/city/${employeeId}/edit/${cityId}` }
  ];



  const cityTable = async () => {
    try {
      let response = {};

      if (filterType === 'active') {
        response = await getAllActiveCities(currentPage, itemsPerPage);
      }
      else if (filterType === 'inactive') {
        response = await getAllInactiveCities(currentPage, itemsPerPage);
      }
      else {
        response = await getAllCities(currentPage, itemsPerPage);
      }

      setData(response);
      setKeysToBeIncluded(["cityId", "cityName", "isActive", "stateId", "stateName"]);

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
    cityTable();

  }, [filter, currentPage, itemsPerPage, searchParams]);




  return (
    <>
      <div className='content-area-city'>
        <AreaTop pageTitle={"Get All Cities"} pagePath={"City"} pageLink={`/admin/dashboard/${routeParams.id}`} />
        <section className="content-area-table-city">
          <div className="data-table-information">
            <h3 className="data-table-title">City</h3>
            {showFilterButton && (
              <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
            )}
            {(filterType === 'active' || filterType === 'inactive') && (
              <div className="filter-container">
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
      <ToastContainer position="bottom-right" />
    </>
  )
}
