import React, { useContext, useEffect, useState } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './policyAccount.scss';
import { getAllPolicyAccounts, getPolicyAccountById } from '../../../services/CustomerServices';

export const PolicyAccount = () => {
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
  const { id: adminId } = useParams();

  const filterOptions = [
    { label: 'Search by Policy Account Id', value: 'id' }
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
    setFilter(true);
  };

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };

  const actions = (policyAccountId) => [
    { name: 'View', url: `/customer/policy-account/${adminId}/view/${policyAccountId}` }
  ];

  const policyAccountsTable = async () => {
    try {
      let response = {};
      if (filterType === 'id') {
        response = await getPolicyAccountById(id);
      }
      else {
        response = await getAllPolicyAccounts(currentPage, itemsPerPage);
      }
      setData(response);
      setKeysToBeIncluded(['policyAccountId', 'createdDate', 'maturedDate', 'claimAmount', 'investmentAmount', 'isActive', 'policyId']);
    } catch (error) {
      setData([]);
      if (error.response?.data?.message || error.specificMessage) {
        errorToast(error.response?.data?.message || error.specificMessage);
      } else {
        errorToast('An unexpected error occurred. Please try again later.');
      }
    }
  };

  useEffect(() => {
    policyAccountsTable();
  }, [filter, currentPage, itemsPerPage, searchParams]);

  return (
    <>
      <div className='content-area-policy-account'>
        <AreaTop pageTitle={'Get All Policy Accounts'} pagePath={'Policy-Accounts'} pageLink={`/customer/policy-account/${routeParams.id}`} />
        <section className="content-area-table-policy-account">
          <div className="data-table-information">
            <h3 className="data-table-title">Policy Accounts</h3>
            {showFilterButton && (
              <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType} />
            )}
            {(filterType === 'id') && (
              <div className="filter-container">
                {filterType === 'id' && (
                  <div className="filter">
                    <input type="number" placeholder="Enter Policy Account Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)} />
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
  );
};
