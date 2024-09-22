import React, { useRef } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import './feedback.scss';
import { errorToast } from '../../../utils/helper/toast';
import { Table } from '../../../sharedComponents/Table/Table';
import { getAllFeedbacks, getFeedbackByCustomerId } from '../../../services/AdminServices';
import { useParams, useSearchParams } from 'react-router-dom';
import { PaginationContext } from '../../../context/PaginationContext';
import { useContext, useEffect, useState } from 'react';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { validateCustomerId } from '../../../utils/validations/Validations';
import { ToastContainer } from 'react-toastify';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Feedback = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [id, setId] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const filterOptions = [
    { label: 'Search by Customer Id', value: 'id' }
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
      setShowPagination(true);
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
  

    const feedbackTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
      try {
          let response = {};
          setLoading(true);
          if(filterTypeFromParams === 'id') {
            validateCustomerId(idFromParams);
            response = await getFeedbackByCustomerId(idFromParams, currentPageFromParams, itemsPerPageFromParams);
          }
          else {
            response = await getAllFeedbacks(currentPageFromParams, itemsPerPageFromParams);
          }
          
          setData(response);
          setKeysToBeIncluded(["feedbackId", "title", "description", "rating",  "customerId"]);

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

    if(filterTypeFromParams === 'id'){
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
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

    feedbackTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

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
        <div className='content-area-feedback'>
        {loading && <Loader />}
          <AreaTop pageTitle={"Get All Feedback"} pagePath={"Feedback"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
          <section className="content-area-table-feedback">
            <div className="data-table-information">
              <h3 className="data-table-title">Feedbacks</h3>
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'id') && (
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
                  includeButton={false}
                  handleButtonClick={null}
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
