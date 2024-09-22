import React, { useEffect, useState, useRef } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  getAllPolicyAccount,
  getAllPolicyAccountByCustomerId,
  getAllPolicyAccountByAgentId,
  downloadPolicyAccountInCSV,
} from '../../../services/AdminServices';
import { errorToast, successToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import './policyAccount.scss';
import { validateCustomer } from '../../../services/AuthServices';
import { validateAgentId } from '../../../utils/validations/Validations';

export const PolicyAccounts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [id, setId] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  const filterOptions = [
    { label: 'Search by Customer Id', value: 'customer' },
    { label: 'Search by Agent Id', value: 'agent' }
  ];

  const prevCurrentPageRef = useRef(currentPage);
  const prevItemsPerPageRef = useRef(itemsPerPage);

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(10);
  };

  const handleSearch = () => {
    resetPagination();
    setSearchParams({ filterType, id , currentPage, itemsPerPage });
    setShowPagination(false);
    setShowFilterButton(false);
  };

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({ currentPage: 1, itemsPerPage: 10 });
  };

  const policyAccountTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams) => {
    try {
      let response = {};
      setLoading(true);
      if (filterTypeFromParams === 'customer') {
        validateCustomer(id);
        response = await getAllPolicyAccountByCustomerId(currentPageFromParams, itemsPerPageFromParams, id);
      } else if (filterTypeFromParams === 'agent') {
        validateAgentId(id);
        response = await getAllPolicyAccountByAgentId(currentPageFromParams, itemsPerPageFromParams, id);
      } else {
        response = await getAllPolicyAccount(currentPageFromParams, itemsPerPageFromParams);
      }

      setData(response);
      setKeysToBeIncluded(['policyAccountId', 'customerId', 'agentId', 'claimAmount', 'createdDate', 'maturedDate', 'isActive', 'investmentAmount', 'policyTerm', 'paymentTimeInMonths', 'timelyBalance', 'nomineeName', 'nomineeRelation', ]);
    } catch (error) {
      setData([]);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPolicyAccountsInCSV = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const response = await downloadPolicyAccountInCSV();
      const csvBlob = new Blob([response], { type: 'text/csv' });

      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = csvUrl;
      link.setAttribute('download', 'policy_accounts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterTypeFromParams = searchParams.get('filterType') || '';
    const currentPageFromParams = parseInt(searchParams.get('currentPage')) || 1;
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 10;
    const idFromParams = searchParams.get('id') || '';

    if (filterTypeFromParams === 'customer' || filterTypeFromParams === 'agent') {
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
      setId(idFromParams);
    } else {
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
  

    policyAccountTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams);
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
      <div className="content-area-policy-accounts">
        {loading && <Loader />}
        <AreaTop
          pageTitle="Policy Accounts"
          pagePath="Policy"
          pageLink={`/admin/dashboard/${routeParams.id}`}
        />
        <section className="content-area-table-policy-accounts">
          <div className="data-table-information">
            <h3 className="data-table-title">Policy Accounts</h3>
            <div className="data-table-buttons">
              {showFilterButton && (
                <FilterButton
                  setShowFilterButton={setShowFilterButton}
                  showFilterButton={showFilterButton}
                  filterOptions={filterOptions}
                  setFilterType={setFilterType}
                />
              )}
              {(filterType === 'customer' || filterType === 'agent') && (
                <div className="filter-container">
                  <div className="filter">
                    <input
                      type="number"
                      placeholder="Enter ID"
                      className="form-input"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>
                  <div className="filter-buttons">
                    <button className="form-submit-b" onClick={handleSearch}>
                      Search
                    </button>
                    <button className="form-submit-b" onClick={handleReset}>
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <button className="form-submit-passbook" onClick={handleDownloadPolicyAccountsInCSV}>
                Download (CSV)
              </button>
            </div>
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
      <ToastContainer position="bottom-right" />
    </>
  );
};
