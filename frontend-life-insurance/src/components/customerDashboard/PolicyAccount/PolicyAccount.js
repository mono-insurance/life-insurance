import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import './policyAccount.scss';
import { getAllPolicyAccounts, getPolicyAccountById } from '../../../services/CustomerServices';
import { Pagination } from '../../../sharedComponents/Table/Pagination/Pagination';
import { Loader } from '../../../sharedComponents/Loader/Loader';
import { validatePolicyAccountId } from '../../../utils/validations/Validations';

export const PolicyAccount = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [data, setData] = useState({});
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [id, setId] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { customerId } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const filterOptions = [
    { label: 'Search by Policy Account Id', value: 'id' }
  ];

  const prevCurrentPageRef = useRef(currentPage);
  const prevItemsPerPageRef = useRef(itemsPerPage);

  const resetPagination = () => {
    setCurrentPage(1);
    setItemsPerPage(5);
  };

  const handleSearch = () => {
    resetPagination();
    if (filterType === 'id') {
      setSearchParams({filterType });
      setShowPagination(false);
    }
    setShowFilterButton(false);
  };

  const handleReset = () => {
    setFilterType('');
    setId('');
    setShowFilterButton(true);
    resetPagination();
    setShowPagination(true);
    setSearchParams({currentPage: 1, itemsPerPage: 5});
  };

  const policyAccountsTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams) => {
    try {
      setLoading(true);
      let response = {};
        if (filterTypeFromParams === 'id') {
          validatePolicyAccountId(id);
          
          response = await getPolicyAccountById(id);
          response.content = [response];
        }
        else {
          response = await getAllPolicyAccounts(currentPageFromParams, itemsPerPageFromParams);
        }
        setData(response);
      } catch (error) {
        setData([]);
        console.log(error);
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
    const itemsPerPageFromParams = parseInt(searchParams.get('itemsPerPage')) || 5;

    if (filterTypeFromParams === 'id') {
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

    if(customerId){
      policyAccountsTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams);
    }
    
  }, [searchParams, customerId]);


  useEffect(() => {
    if (currentPage != prevCurrentPageRef.current || itemsPerPage != prevItemsPerPageRef.current) {
      prevCurrentPageRef.current = currentPage;
      prevItemsPerPageRef.current = itemsPerPage;
      setSearchParams({
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
      });
    }
  }, [currentPage, itemsPerPage, setSearchParams, searchParams]);


  return (
    <>
      <div className='content-area-policy-account'>
      {loading && <Loader />}
        <section className="content-area-table-policy-account">
          <div className="data-table-information">
            <p className="data-table-title font-medium text-zinc-700 border-b">My Policy Accounts</p>
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
          <div>
            {data && data.content && data.content.length > 0 ? (
              <div className='flex flex-col gap-4 sm:gap-6 py-2 border-b'>
              {data.content.map((policyAccount, index) => (
                <div key={index} className="bg-gray-100 data-table-row flex flex-col sm:flex-row gap-4 p-4 border border-gray-400 rounded-lg shadow-lg object-cover transition-transform duration-300 ease-in-out transform hover:scale-110">
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-900">Policy Account Number</p>
                    <p className="text-lg text-gray-700">{policyAccount.policyAccountId}</p>
                    <p className="mt-2 text-sm text-gray-500">Created Date</p>
                    <p className="text-lg text-gray-700">{new Date(policyAccount.createdDate).toLocaleDateString()}</p>
                    <p className="mt-2 text-sm text-gray-500">Matured Date</p>
                    <p className="text-lg text-gray-700">{new Date(policyAccount.maturedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-900">Claim Amount</p>
                    <p className="text-lg text-gray-700">{policyAccount.claimAmount}</p>
                    <p className="mt-2 text-sm text-gray-500">Total Investment Amount</p>
                    <p className="text-lg text-gray-700">{policyAccount.investmentAmount}</p>
                    </div>
                    <div className="flex-1">
                    <p className="mt-2 text-sm text-gray-500">Active Status</p>
                    <p className={`text-lg ${policyAccount.isActive ? 'text-green-500' : 'text-red-500'}`}>
                      {policyAccount.isActive ? 'Active' : 'Inactive'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Policy Id</p>
                    <p className="text-lg text-gray-700">SCH{policyAccount.policyId}</p>
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    <button
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-indigo-400 hover:text-white rounded-md"
                      onClick={() => navigate(`/suraksha/customer/policy-account/view/${policyAccount.policyAccountId}`)}>
                      View
                    </button>
                  </div>
                </div>
              ))}
              {showPagination && (
                  <Pagination
                    noOfPages={data.totalPages}
                    noOfElements={data.totalElements}
                    currentPage={currentPage}
                    showPagination={showPagination}
                    pageSize={itemsPerPage}
                    setPage={setCurrentPage}
                    setPageSize={setItemsPerPage}
                  />
                )}
            </div>

            ) : (
              <p>No Schemes Purchased</p>
            )}
          </div>
        </section>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
};
