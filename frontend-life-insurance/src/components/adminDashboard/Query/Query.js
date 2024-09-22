import React, { useRef } from 'react'
import { Table } from '../../../sharedComponents/Table/Table';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { PaginationContext } from '../../../context/PaginationContext';
import { useContext, useEffect, useState } from 'react';
import { getAllQueries, getAllResolvedQueries, getAllUnresolvedQueries, getQueriesByCustomerId } from '../../../services/AdminServices';
import { useParams, useSearchParams } from 'react-router-dom';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../utils/helper/helperFunctions';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';
import './query.scss';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Query = () => {
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { label: 'Search by Customer Id', value: 'id' },
    { label: 'Search by Resolved', value: 'resolved' },
    { label: 'Search by Unresolved', value: 'unresolved' }
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
      setSearchParams({filterType, id, currentPage, itemsPerPage});
    }
    if(filterType === 'resolved'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    if(filterType === 'unresolved'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    setShowFilterButton(false);
  }
  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setResolved('');
    setShowFilterButton(true);
    resetPagination();
    setSearchParams({currentPage: 1, itemsPerPage: 10});
  };

  const actions = (queryId) => [
    { name: "Edit", url: `/suraksha/admin/query/${adminId}/edit/${queryId}` },
    { name: "Delete", url: `/suraksha/admin/query/${adminId}/delete/${queryId}` }
  ];
  


    const queryTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
      try {
          let response = {};
          setLoading(true);
          if(filterTypeFromParams === 'resolved') {
            response = await getAllResolvedQueries(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'unresolved') {
            response = await getAllUnresolvedQueries(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'id') {
            validateCustomerId(idFromParams);
            const data = await getQueriesByCustomerId(idFromParams, currentPageFromParams, itemsPerPageFromParams);
            response = covertIdDataIntoTable(data);
          }
          else {
            response = await getAllQueries(currentPageFromParams, itemsPerPageFromParams);
          }
          
          setData(response);
          setKeysToBeIncluded(["queryId", "question", "response", "isResolved",  "customerId"]);

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

    if (filterTypeFromParams === 'resolved' || filterTypeFromParams === 'unresolved') {
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
    } else if(filterTypeFromParams === 'id'){
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setId(idFromParams);
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

    queryTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

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
        <div className='content-area-query'>
        {loading && <Loader />}
          <AreaTop pageTitle={"Get All Queries"} pagePath={"Query"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
          <section className="content-area-table-query">
            <div className="data-table-information">
              <h3 className="data-table-title">Queries</h3>
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'resolved' ||  filterType === 'unresolved' || filterType === 'id') && (
                  <div className="filter-container">
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
                  handleButtonClick={actions}
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