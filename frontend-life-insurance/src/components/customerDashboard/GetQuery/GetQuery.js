import React, { useContext, useEffect, useRef, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import './getQuery.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { getAllResolvedQueries } from '../../../services/AdminServices';
import { Pagination } from '../../../sharedComponents/Table/Pagination/Pagination';
import { getAllResolvedQueriesByCustomer, getAllUnresolvedQueriesByCustomer } from '../../../services/CustomerServices';
import { TableAction } from '../../../sharedComponents/Table/TableAction/TableAction';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const GetQuery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const {customerId} = useOutletContext();
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { label: 'Your resolved Queries', value: 'your-resolved-query' },
    { label: 'Your Unresolved Queries', value: 'your-unresolved-query' }
];

const prevCurrentPageRef = useRef(currentPage);
const prevItemsPerPageRef = useRef(itemsPerPage);

const resetPagination = () => {
  setCurrentPage(1);
  setItemsPerPage(10);
};

  const handleSearch = () => {
    resetPagination();
    if(filterType === 'your-resolved-query'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    if(filterType === 'your-unresolved-query'){
      setSearchParams({filterType, currentPage, itemsPerPage});
    }
    setShowFilterButton(false);
  }
  
  const handleReset = () => {
    setFilterType('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({currentPage: 1, itemsPerPage: 10});
  };

  const unresolvedActions = (queryId) => [
    { name: "Edit", url: `/suraksha/customer/query/edit/${queryId}` },
    { name: "Delete", url: `/suraksha/customer/query/delete/${queryId}` }
  ];

  const fetchQueries = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams) => {
    try {
        setLoading(true);
        let response = {};

        if(filterTypeFromParams === 'your-resolved-query') {
          response = await getAllResolvedQueriesByCustomer(currentPageFromParams, itemsPerPageFromParams, customerId);
        }
        else if(filterTypeFromParams === 'your-unresolved-query') {
          response = await getAllUnresolvedQueriesByCustomer(currentPageFromParams, itemsPerPageFromParams, customerId);
        }
        else {
          response = await getAllResolvedQueries(currentPageFromParams, itemsPerPageFromParams);
        }
        console.log(currentPage, itemsPerPage, filterType);
        console.log(response);
        setData(response);

    } catch (error) {
        setData([]);
        if (error.response?.data?.message || error.specificMessage) {
          errorToast(error.response?.data?.message || error.specificMessage);
        } else {
            errorToast("An unexpected error occurred. Please try again later.");
        }
    } finally{
        setLoading(false);
    }
};

  useEffect(() => {
    const filterTypeFromParams = searchParams.get('filterType') || '';
    const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;

    if (filterTypeFromParams === 'your-resolved-query' || filterTypeFromParams === 'your-unresolved-query') {
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
    if (customerId) {
      fetchQueries(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams);
    }
  }, [searchParams, customerId]);

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
        <div className='flex justify-between'>
        <AreaTop pageTitle={"Get All Queries"} pagePath={"Queries"} pageLink={`/suraksha/insurances`} />
        <button type="button" className="form-submit-b rounded-full" onClick={()=> navigate('/suraksha/customer/add-query')}>
            Ask Query
        </button>
        </div>
        <section className="content-area-list-query">
            <div className="data-table-information">
              <h3 className="data-table-title">All FAQs</h3>
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'your-resolved-query' || filterType === 'your-unresolved-query') && (
                  <div className="filter-container">
                    <div className="filter-buttons">
                      <button className="form-submit-b" onClick={handleSearch}>Search</button>
                      <button className="form-submit-b" onClick={handleReset}>Clear</button>
                    </div>
                  </div>
                )}
            </div>
            <div className="query-list">
                {data && data.content && data.content.length > 0 ? (
                    <>
                    {data.content.map((query, index) => (
                        <div key={index} className="query-item">
                            {(filterType === 'your-unresolved-query' && !query.isResolved) && (
                                <TableAction actions={unresolvedActions(query.queryId)} />
                            )}
                            <p className="question"><strong>Question:</strong> {query.question}</p>
                            <p className="answer"><strong>Answer:</strong> {query.response}</p>
                        
                        </div>
                    ))}

                    {showPagination && (
                        <Pagination
                          noOfPages={data.totalPages}
                          noOfElements={data.totalElements}
                          currentPage={currentPage}
                          pageSize={itemsPerPage}
                          setPage={setCurrentPage}
                          setPageSize={setItemsPerPage}
                        />
                    )}
                    </>
                ) : (
                    <div>No FAQs found.</div>
                )}
            </div>

        </section>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};
