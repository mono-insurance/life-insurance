import React, { useContext, useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { PaginationContext } from '../../../context/PaginationContext';
import './getQuery.scss';
import { ToastContainer } from 'react-toastify';
import { errorToast } from '../../../utils/helper/toast';
import { useParams, useSearchParams } from 'react-router-dom';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { getAllResolvedQueries } from '../../../services/AdminServices';
import { Pagination } from '../../../sharedComponents/Table/Pagination/Pagination';
import { getAllResolvedQueriesByCustomer, getAllUnresolvedQueriesByCustomer } from '../../../services/CustomerServices';
import { TableAction } from '../../../sharedComponents/Table/TableAction/TableAction';

export const GetQuery = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const routeParams = useParams();
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [resolved, setResolved] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: customerId } = useParams();
  const filterOptions = [
    { label: 'Your resolved Queries', value: 'your-resolved-query' },
    { label: 'Your Unresolved Queries', value: 'your-unresolved-query' }
];

const resetPagination = () => {
  setCurrentPage(1);
  setItemsPerPage(10);
};

  const handleSearch = () => {
    resetPagination();
    if(filterType === 'your-resolved-query'){
      setSearchParams({filterType, resolved, currentPage, itemsPerPage});
      setResolved('true');
    }
    if(filterType === 'your-unresolved-query'){
        setSearchParams({filterType, resolved, currentPage, itemsPerPage});
        setResolved('false');
    }
    if(filter === false) {
      setFilter(true);
    }
    else{
        fetchQueries();
    }
  }
  
  const handleReset = () => {
    setFilterType('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setResolved('');
    setShowPagination(true);
    setSearchParams({});
  };

  const unresolvedActions = (queryId) => [
    { name: "Edit", url: `/customer/query/${customerId}/edit/${queryId}` },
    { name: "Delete", url: `/customer/query/${customerId}/delete/${queryId}` }
  ];

  const fetchQueries = async () => {
    try {
        let response = {};

        if(filterType === 'your-resolved-query') {
          response = await getAllResolvedQueriesByCustomer(currentPage, itemsPerPage, routeParams.id);
        }
        else if(filterType === 'your-unresolved-query') {
          response = await getAllUnresolvedQueriesByCustomer(currentPage, itemsPerPage, routeParams.id);
        }
        else {
          response = await getAllResolvedQueries(currentPage, itemsPerPage);
        }
        console.log(response);
        setData(response);
        setKeysToBeIncluded(["question", "answer"]);

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
    fetchQueries();

  }, [filter, currentPage, itemsPerPage, searchParams]);

  return (
    <>
      <div className='content-area-query'>
        <AreaTop pageTitle={"Get All Queries"} pagePath={"Queries"} pageLink={`/customer/policy-account/${routeParams.id}`} />
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
