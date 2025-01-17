import React from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import './getAgents.scss';
import { ToastContainer } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAllActiveAgents, getAllAgents, getAllInactiveAgents, getAgentsById, downloadAgentsInCSV} from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { covertIdDataIntoTable } from '../../../utils/helper/helperFunctions';
import { validateAgentId } from '../../../utils/validations/Validations';
import {  useEffect, useState, useRef } from 'react';
import { Loader } from '../../../sharedComponents/Loader/Loader';


export const GetAgents = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const [id, setId] = useState('');
  const [active, setActive] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const filterOptions = [
    { label: 'Search by Agent Id', value: 'id' },
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
      if(filterType === 'id'){
        setSearchParams({filterType, id});
        setShowPagination(false);
      }
      if(filterType === 'active' || filterType === 'inactive'){
        setSearchParams({filterType, currentPage, itemsPerPage});
        setShowPagination(true);
      }
      setShowFilterButton(false);
    }
    
    const handleReset = () => {
      setFilterType('');
      setId('');
      setActive('');
      setShowFilterButton(true);
      resetPagination();
      setShowPagination(true);
      setSearchParams({currentPage: 1, itemsPerPage: 10});
    };



    const agentTable = async (filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams) => {
      try {
          let response = {};
          setLoading(true);
          if(filterTypeFromParams === 'active') {
            response = await getAllActiveAgents(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'inactive') {
            response = await getAllInactiveAgents(currentPageFromParams, itemsPerPageFromParams);
          }
          else if(filterTypeFromParams === 'id') {
            validateAgentId(idFromParams);
            const data = await getAgentsById(idFromParams);
            response = covertIdDataIntoTable(data);
          }
          else {
            response = await getAllAgents(currentPageFromParams, itemsPerPageFromParams);
          }
          
          setData(response);
          setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "mobileNumber", "isActive", "isApproved"]);

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

    if (filterTypeFromParams === 'active' || filterTypeFromParams === 'inactive' ) {
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(true);
    } else if(filterTypeFromParams === 'id'){
      setFilterType(filterTypeFromParams);
      setShowFilterButton(false);
      setShowPagination(false);
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

    agentTable(filterTypeFromParams, currentPageFromParams, itemsPerPageFromParams, idFromParams);

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


    const handleDownloadAgentsInCSV = async (event) => {
      event.preventDefault();
      try {
        setLoading(true);
    
        const response = await downloadAgentsInCSV(); 
        
        const csvBlob = new Blob([response], { type: 'text/csv' });
    
        const csvUrl = URL.createObjectURL(csvBlob);
    
        const link = document.createElement('a');
        link.href = csvUrl;
    
        link.setAttribute('download', 'requests.csv');
    
        document.body.appendChild(link);
        link.click();
        link.remove();
    
      } catch (error) {
        console.log(error);
        const errorMessage = error.response?.data?.message || error.specificMessage || 'An unexpected error occurred. Please try again later.';
        errorToast(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  


  return (
    <>
        <div className='content-area-agents'>
        {loading && <Loader />}
          <AreaTop pageTitle={"Get All Agents"} pagePath={"Agent"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`}/>
          <section className="content-area-table-agents">
            <div className="data-table-information">
              <h3 className="data-table-title">Agents</h3>
              <div className="data-table-buttons">
                {showFilterButton && (
                  <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
                )}
                {(filterType === 'active' ||  filterType === 'inactive' || filterType === 'id') && (
                  <div className="filter-container">
                    {filterType === 'id' && (
                      <div className="filter">
                          <input type="number" placeholder="Enter Agent Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
                      </div>
                    )}
                    <div className="filter-buttons">
                      <button className="form-submit-b" onClick={handleSearch}>Search</button>
                      <button className="form-submit-b" onClick={handleReset}>Clear</button>
                    </div>
                  </div>
                )}
                <button className="form-submit-passbook" onClick={handleDownloadAgentsInCSV}>Download (CSV)</button>
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
        <ToastContainer position="bottom-right"/>
      </>
  )
}
