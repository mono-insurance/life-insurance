import React, { useState, useEffect } from 'react';
import { AreaTop } from '../../../sharedComponents/Title/Title';
import { Table } from '../../../sharedComponents/Table/Table';
import './commission.scss';
import { ToastContainer } from 'react-toastify';
import { getAllRegistrationCommissions, getAllInstallmentCommissions } from '../../../services/AdminServices';
import { errorToast } from '../../../utils/helper/toast';
import { useParams } from 'react-router-dom';

export const Commission = () => {
  const [registrationData, setRegistrationData] = useState({});
  const [installmentData, setInstallmentData] = useState({});
  const [registrationPage, setRegistrationPage] = useState(1);
  const [installmentPage, setInstallmentPage] = useState(1);
  const [registrationPageSize, setRegistrationPageSize] = useState(10);
  const [installmentPageSize, setInstallmentPageSize] = useState(10);
  const [keysToBeIncluded] = useState(["agentId", "agentName", "amount", "policyAccountId"]);
  const routeParams = useParams();

  
  const fetchRegistrationCommissions = async () => {
    try {
      const response = await getAllRegistrationCommissions(registrationPage, registrationPageSize);
      setRegistrationData(response);
    } catch (error) {
      errorToast(error.response?.data?.message || "Error fetching registration commissions.");
    }
  };

  
  const fetchInstallmentCommissions = async () => {
    try {
      const response = await getAllInstallmentCommissions(installmentPage, installmentPageSize);
      setInstallmentData(response);
    } catch (error) {
      errorToast(error.response?.data?.message || "Error fetching installment commissions.");
    }
  };

  useEffect(() => {
    fetchRegistrationCommissions();
  }, [registrationPage, registrationPageSize]);

  useEffect(() => {
    fetchInstallmentCommissions();
  }, [installmentPage, installmentPageSize]);

  return (
    <div className='content-area-commissions'>
      <AreaTop pageTitle={"Get All Commissions"} pagePath={"Claim"} pageLink={`/admin/dashboard/${routeParams.id}`} />

      
      <section className="content-area-table-commissions">
        <div className="data-table-information">
          <h3 className="data-table-title">Registration Commissions</h3>
        </div>
        <div className="data-table-diagram">
          <Table
            data={registrationData}
            keysToBeIncluded={keysToBeIncluded}
            includeButton={false}
            handleButtonClick={null}
            currentPage={registrationPage}
            pageSize={registrationPageSize}
            setPage={setRegistrationPage}
            setPageSize={setRegistrationPageSize}
          />
        </div>
        <h3 className='data-table-body'>Total Balance: {registrationData.totalBalance}</h3>
      </section>

      
      <section className="content-area-table-commissions">
        <div className="data-table-information">
          <h3 className="data-table-title">Installment Commissions</h3>
        </div>
        <div className="data-table-diagram">
          <Table
            data={installmentData}
            keysToBeIncluded={keysToBeIncluded}
            includeButton={false}
            handleButtonClick={null}
            currentPage={installmentPage}
            pageSize={installmentPageSize}
            setPage={setInstallmentPage}
            setPageSize={setInstallmentPageSize}
          />
        </div>
        <h3 className='data-table-body'>Total Balance: {installmentData.totalBalance}</h3>
      </section>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
