import React, { useContext, useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { Card } from '../../../sharedComponents/Card/Card'
import './dashboard.scss';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Table } from '../../../sharedComponents/Table/Table';
import { PaginationContext } from '../../../context/PaginationContext';
import { ProgressBar } from '../../../sharedComponents/ProgressBar/ProgresBar';
import { useParams, useSearchParams } from 'react-router-dom';
import { covertIdDataIntoTable, formatRoleForTable } from '../../../services/SharedServices';
import { getAllUsers, getAllUsersByCharacters, getSystemStats, getUserById } from '../../../services/AdminServices';
import { FilterButton } from '../../../sharedComponents/FilterButton/FilterButton';
import { validateFirstName, validateUserId } from '../../../utils/validations/Validations';

export const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const {currentPage, itemsPerPage, resetPagination, handlePageChange, handleItemsPerPageChange} = useContext(PaginationContext);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const [showFilterButton, setShowFilterButton] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [filter, setFilter] = useState(false);
  const routeParams = useParams();
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showPagination, setShowPagination] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterOptions = [
    { label: 'Search by User Id', value: 'id' },
    { label: 'Search by Characters', value: 'firstName' }
];


  const handleSearch = () => {
    resetPagination();
    if(filterType === 'id'){
      setSearchParams({filterType, id});
      setShowPagination(false);
    }
    if(filterType === 'firstName'){
      setSearchParams({filterType, firstName, currentPage, itemsPerPage});
      setShowPagination(true);
    }
    if(filter === false) {
      setFilter(true);
    }
    else{
      userTable();
    }
  }

  
  const handleReset = () => {
    setFilterType('');
    setId('');
    setFirstName('');
    setShowFilterButton(true);
    resetPagination();
    setFilter(false);
    setShowPagination(true);
    setSearchParams({});
  };



    const userTable = async () => {
      try {
          let response = {};
          let formattedData =[];
          if(filterType === 'firstName') {
            validateFirstName(firstName);
            // response = await getAllUsersByCharacters(currentPage, itemsPerPage, firstName);
            formattedData = formatRoleForTable(response);
          }
          else if(filterType === 'id') {
            validateUserId(id);
            // const data = await getUserById(id);
            response = covertIdDataIntoTable(data);
            formattedData = formatRoleForTable(response);
          }
          else {
            // response = await getAllUsers(currentPage, itemsPerPage);
            formattedData = formatRoleForTable(response);
          }
          
          setData({
            content: formattedData,
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last
          });
          setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "role"]);

      } catch (error) {
          setData([]);
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
      }
  };

    const generateData = () =>{
      return [
        {
          id: 1,
          name: "Total Admins",
          percentValues: counts.totalAdmins,
        },
        {
          id: 2,
          name: "Total Requests",
          percentValues: counts.totalCompletedRequests,
        },
        {
          id: 3,
          name: "Total Accounts",
          percentValues: counts.totalAccounts,
        },
        {
          id: 4,
          name: "Total Completed Requests",
          percentValues: counts.totalCompletedRequests,
        },
        {
          id: 5,
          name: "Total Requests",
          percentValues: (counts.totalCompletedRequests + counts.totalAccountPendingRequests + counts.totalCustomerPendingRequests),
        },
      ];
    };

    useEffect(() => {
      const fetchSystemCounts = async () => {
        try {
            // const response = await getSystemStats();
            const response = {};
            setCounts(response);
            console.log(response);

        } catch (error) {
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
        }
    };
    fetchSystemCounts();
    },[]);

    useEffect(() => {
      const filterTypeParam = searchParams.get('filterType') || '';
      const idParam = searchParams.get('id') || '';
      const firstNameParam = searchParams.get('firstName') || '';
      const currentPageParam = Number(searchParams.get('currentPage')) || 1;
      const itemsPerPageParam = Number(searchParams.get('itemsPerPage')) || 10;
      console.log(filterTypeParam, idParam, firstNameParam, currentPageParam, itemsPerPageParam);
      if (filterTypeParam === 'id' || filterTypeParam === 'firstName') {
        setFilterType(filterTypeParam);
        setShowFilterButton(!filterTypeParam);
        setFilter(true);
        if (filterTypeParam === 'firstName') {
          setFirstName(firstNameParam);
          handlePageChange(currentPageParam);
          handleItemsPerPageChange(itemsPerPageParam);
        } else if (filterTypeParam === 'id') {
          setId(idParam);
          setShowPagination(false);
          resetPagination();
        }
      } else {
        setShowFilterButton(true);
        setId('');
        setFirstName('');
        setFilterType('');
        setFilter(false);
        setShowPagination(true);
        resetPagination();
      }
    },[searchParams]);


    useEffect(() => {
      const hasSearchParams = searchParams.toString() !== '';
      
      if(!hasSearchParams) {
        setShowFilterButton(true);
        setId('');
        setFirstName('');
        setFilterType('');
        setFilter(false);
        setShowPagination(true);
        resetPagination();
      }
      const timeoutId = setTimeout(() => {
        userTable();
      }, hasSearchParams ? 0: 0);
      return () => clearTimeout(timeoutId);

    }, [filter, currentPage, itemsPerPage, searchParams]);



  return (
    <>
      <AreaTop pageTitle={"Admin Dashboard"} pagePath={"Dashboard"} pageLink={`/admin/dashboard/${routeParams.id}`} />
      <section className="content-area-cards">
        <Card
          colors={["#e4e8ef", "#4ce13f"]}
          percentFillValue={(counts.totalActiveCustomers / (counts.totalCustomers || 1)) * 100} 
          cardInfo={{
            title: "Active Customers",
            value: counts.totalActiveCustomers,
            text: "Current Active customers",
          }}
        />
        <Card
          colors={["#e4e8ef", "#f29a2e"]}
          percentFillValue={(counts.totalInactiveCustomers / (counts.totalCustomers || 1)) * 100} 
          cardInfo={{
            title: "Inactive Customers",
            value: counts.totalInactiveCustomers,
            text: "Current Inactive customers",
          }}
        />
        <Card
          colors={["#e4e8ef", "#475be8"]}
          percentFillValue={(counts.totalCustomerPendingRequests / ((counts.totalAccountPendingRequests+counts.totalCustomerPendingRequests) || 1)) * 100} 
          cardInfo={{
            title: "Customers Requests",
            value: counts.totalCustomerPendingRequests,
            text: "New requests for customers",
          }}
        />
        <Card
          colors={["#e4e8ef", "#4ce13f"]}
          percentFillValue={(counts.totalActiveAccounts / (counts.totalAccounts || 1)) * 100} 
          cardInfo={{
            title: "Active Accounts",
            value: counts.totalActiveAccounts,
            text: "Current Active Accounts",
          }}
        />
        <Card
          colors={["#e4e8ef", "#f29a2e"]}
          percentFillValue={(counts.totalInactiveAccounts / (counts.totalAccounts || 1)) * 100} 
          cardInfo={{
            title: "Inactive Accounts",
            value: counts.totalInactiveAccounts,
            text: "Current Inactive Accounts",
          }}
        />
        <Card
          colors={["#e4e8ef", "#475be8"]}
          percentFillValue={(counts.totalAccountPendingRequests / ((counts.totalAccountPendingRequests+counts.totalCustomerPendingRequests) || 1)) * 100} 
          cardInfo={{
            title: "Accounts Requests",
            value: counts.totalAccountPendingRequests,
            text: "New requests for accounts",
          }}
        />
      </section>
      <section className="content-area-charts">
          <ProgressBar  data = {generateData()}/>
      </section>
      <section className="content-area-table">
        <div className="data-table-infor">
          <h3 className="data-table-title">All Users</h3>
              {showFilterButton && (
                <FilterButton setShowFilterButton={setShowFilterButton} showFilterButton={showFilterButton} filterOptions={filterOptions} setFilterType={setFilterType}/>
              )}
              {(filterType === 'firstName' || filterType === 'id') && (
                <div className="filter-container">
                  {filterType === 'firstName' && (
                    <div className="filter">
                      <input type="text" placeholder="Enter Characters" className="form-input" name={firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                  )}
                  {filterType === 'id' && (
                    <div className="filter">
                        <input type="number" placeholder="Enter User Id" className="form-input" name={id} value={id} onChange={(e) => setId(e.target.value)}/>
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
            />
          </div>
      </section>
      <ToastContainer position="bottom-right" />
    </>
  )
}
