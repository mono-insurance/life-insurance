import React, { useContext, useEffect, useRef, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import './getState.scss';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAllActiveStates, getAllInactiveStates, getAllStates } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const GetState = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState({});
    const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
    const routeParams = useParams();
    const [showFilterButton, setShowFilterButton] = useState(true);
    const [filterType, setFilterType] = useState('');
    const [showPagination, setShowPagination] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { id: adminId } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const filterOptions = [
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
      setShowFilterButton(true);
      resetPagination();
      setShowPagination(true);
      setSearchParams({currentPage: 1, itemsPerPage: 10});
    };
  
    const actions = (stateId) => [
      { name: "Edit", url: `/suraksha/admin/state/${adminId}/edit/${stateId}` },
      { name: "Delete", url: `/suraksha/admin/state/${adminId}/delete/${stateId}` }
    ];
    
  
  
      const stateTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams) => {
        try {
            setLoading(true);
            let response = {};

            if(filterTypeFromParams === 'active') {
              response = await getAllActiveStates(currentPageFromParams, itemsPerPageFromParams);
            }
            else if(filterTypeFromParams === 'inactive') {
              response = await getAllInactiveStates(currentPageFromParams, itemsPerPageFromParams);
            }
            else {
              response = await getAllStates(currentPageFromParams, itemsPerPageFromParams);
            }
            
            setData(response);
            setKeysToBeIncluded(["stateId", "stateName", "isActive"]);
  
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
  
      if (filterTypeFromParams === 'active' || filterTypeFromParams === 'inactive') {
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

      stateTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams);

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
        <div className='content-area-states'>
        {loading && <Loader />}
        <div className='flex justify-between'>
        <AreaTop pageTitle={"Get All States"} pagePath={"State"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
          <button type="button" className="form-submit-b rounded-full" onClick={()=> navigate(`/suraksha/admin/add-state/${routeParams.id}`)}>
              Add State
          </button>
        </div>
          
          <section className="content-area-table-states">
            <div className="data-table-information">
              <h3 className="data-table-title">States</h3>
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'active' ||  filterType === 'inactive') && (
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
        <ToastContainer position="bottom-right"/>
        </>
  )
}
