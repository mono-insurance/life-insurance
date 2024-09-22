import React, { useEffect, useState } from 'react'
import { AreaTop } from '../../../sharedComponents/Title/Title'
import { Card } from '../../../sharedComponents/Card/Card'
import './dashboard.scss';
import { errorToast } from '../../../utils/helper/toast';
import { ToastContainer } from 'react-toastify';
import { Table } from '../../../sharedComponents/Table/Table';
import { ProgressBar } from '../../../sharedComponents/ProgressBar/ProgresBar';
import { useParams } from 'react-router-dom';
import { formatRoleForTable } from '../../../utils/helper/helperFunctions';
import { getNewUsers, getSystemStats } from '../../../services/AdminServices';
import { Loader } from '../../../sharedComponents/Loader/Loader';

export const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [keysToBeIncluded, setKeysToBeIncluded] = useState([]);
  const routeParams = useParams();
  const [loading, setLoading] = useState(true);


    const userTable = async () => {
      try {
        setLoading(true);
          let response = {};
          let formattedData =[]
          response = await getNewUsers(currentPage, itemsPerPage);
          formattedData = formatRoleForTable(response);
          
          setData({
            content: formattedData,
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last
          });
          setKeysToBeIncluded(["id", "firstName", "lastName", "username",  "email", "mobileNumber", "role"]);

      } catch (error) {
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
      }finally{
        setLoading(false);
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
          name: "Total Customers",
          percentValues: counts.totalCustomers,
        },
        {
          id: 3,
          name: "Total Agents",
          percentValues: counts.totalAgents,
        },
        {
          id: 4,
          name: "Total Employees",
          percentValues: counts.totalEmployees,
        },
        {
          id: 5,
          name: "Total Users",
          percentValues: (counts.totalAdmins + counts.totalCustomers + counts.totalAgents + counts.totalEmployees),
        },
      ];
    };

    useEffect(() => {
      const fetchSystemCounts = async () => {
        try {
          setLoading(true);
            const response = await getSystemStats();
            setCounts(response);
            console.log(response);

        } catch (error) {
          if (error.response?.data?.message || error.specificMessage) {
            errorToast(error.response?.data?.message || error.specificMessage);
          } else {
              errorToast("An unexpected error occurred. Please try again later.");
          }
        }finally{
          setLoading(false);
        }
    };
    fetchSystemCounts();
    },[]);


    useEffect(() => {
        userTable();
    }, [currentPage, itemsPerPage]);



  return (
    <>
      <AreaTop pageTitle={"Admin Dashboard"} pagePath={"Dashboard"} pageLink={`/suraksha/admin/dashboard/${routeParams.id}`} />
      {loading && <Loader />}
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
          // colors={["#e4e8ef", "#475be8"]}
          colors={["#e4e8ef", "#4ce13f"]}
          percentFillValue={(counts.totalActiveAgents / (counts.totalAgents || 1)) * 100} 
          cardInfo={{
            title: "Active Agents",
            value: counts.totalActiveAgents,
            text: "Current Active agents",
          }}
        />
        <Card
          colors={["#e4e8ef", "#4ce13f"]}
          percentFillValue={(counts.totalActiveEmployees / (counts.totalEmployees || 1)) * 100} 
          cardInfo={{
            title: "Active Emloyees",
            value: counts.totalActiveEmployees,
            text: "Current Active employees",
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
          colors={["#e4e8ef", "#f29a2e"]}
          percentFillValue={(counts.totalInactiveAgents / (counts.totalAgents || 1)) * 100} 
          cardInfo={{
            title: "Inactive Agents",
            value: counts.totalInactiveAgents,
            text: "Current Inactive agents",
          }}
        />
        <Card
          colors={["#e4e8ef", "#f29a2e"]}
          percentFillValue={(counts.totalInactiveEmployees / (counts.totalEmployees || 1)) * 100} 
          cardInfo={{
            title: "Inactive Employees",
            value: counts.totalInactiveEmployees,
            text: "Current Inactive employees",
          }}
        />
      </section>
      <section className="content-area-charts">
          <ProgressBar  data = {generateData()}/>
      </section>
      <section className="content-area-table-customers">
        <div className="data-table-infor">
          <h3 className="data-table-title">New Users</h3>
          </div>
          <div className="data-table-diagram">
            <Table
              data={data}
              keysToBeIncluded={keysToBeIncluded} 
              includeButton={false}
              handleButtonClick={null}
              currentPage={currentPage}
              pageSize={itemsPerPage}
              setPage={setCurrentPage}
              setPageSize={setItemsPerPage}
            />
          </div>
      </section>
      <ToastContainer position="bottom-right" />
    </>
  )
}
