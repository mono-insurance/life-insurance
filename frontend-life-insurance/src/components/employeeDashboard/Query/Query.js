import React from 'react'
import { Table } from '../../../sharedComponents/Table/Table';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { PaginationContext } from '../../../context/PaginationContext';
import { useContext, useEffect, useState } from 'react';
import { getAllQueries, getAllResolvedQueries, getAllUnresolvedQueries, getQueriesByCustomerId } from '../../../services/AdminServices';
import { useParams, useSearchParams } from 'react-router-dom';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../services/SharedServices';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';
import './query.scss';

export const EmpQuery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [id, setId] = useState('');
  const [resolved, setResolved] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: adminId } = useParams();
  const filterOptions = [
    { label: 'Search by Customer Id', value: 'id' },
    { label: 'Search by Resolved', value: 'resolved' },
    { label: 'Search by Unresolved', value: 'unresolved' }
  ];

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = () => {
    resetPagination();
    if (filterType === 'id') {
      setSearchParams({ filterType, id });
      setShowPagination(false);
    }
    if (filterType === 'resolved') {
      setSearchParams({ filterType, resolved, currentPage, itemsPerPage });
      setShowPagination(true);
    }
    if (filterType === 'unresolved') {
      setSearchParams({ filterType, resolved, currentPage, itemsPerPage });
      setShowPagination(true);
    }
    if (filter === false) {
      setFilter(true);
    }
    else {
      queryTable();
    }
  }

  const handleReset = () => {
    setFilterType('');
    setId('');
    setResolved('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const actions = (queryId) => [
    { name: "Edit", url: `/employee/query/${adminId}/edit/${queryId}` },
    { name: "Delete", url: `/employee/query/${adminId}/delete/${queryId}` }
  ];



  const queryTable = async () => {
    try {
      let response = {};

      if (filterType === 'resolved') {
        response = await getAllResolvedQueries(currentPage, itemsPerPage);
      }
      else if (filterType === 'unresolved') {
        response = await getAllUnresolvedQueries(currentPage, itemsPerPage);
      }
      else if (filterType === 'id') {
        validateCustomerId(id);
        const data = await getQueriesByCustomerId(id);
        response = covertIdDataIntoTable(data);
      }
      else {
        response = await getAllQueries(currentPage, itemsPerPage);
      }

      setData(response);
      setKeysToBeIncluded(["queryId", "question", "response", "isResolved", "customerId"]);

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
    queryTable();

  }, [filter, currentPage, itemsPerPage, searchParams]);

  return (
    <>
      <div className='content-area-query'>
        <AreaTop pageTitle={"Get All Queries"} pagePath={"Query"} pageLink={`/admin/dashboard/${routeParams.id}`} />
        <section className="content-area-table-query">
          <div className="data-table-information">
            <h3 className="data-table-title">Queries</h3>
            {showFilterButton && (
              <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
            )}
            {(filterType === 'resolved' || filterType === 'unresolved' || filterType === 'id') && (
              <div className="filter-container">
                {filterType === 'id' && (
                  <div className="filter">
                    <input type="number" placeholder="Enter Customer Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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
      <ToastContainer position="bottom-right" />
    </>

  )
}