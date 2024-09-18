import { Route, Routes } from 'react-router-dom';
import { Login } from './components/securityDashboard/Login/Login';
import { AdminDashboard } from './components/adminDashboard/AdminDashboard';
import { Dashboard } from './components/adminDashboard/Dashboard/Dashboard';
import { ThemeContext } from './context/ThemeContext';
import { useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SunIcon from './assets/icons/sun.svg';
import MoonIcon from './assets/icons/moon.svg';
import './App.scss';
import { SecurityDashboard } from './components/securityDashboard/SecurityDashboard';
import { Register } from './components/securityDashboard/Register/Register';
import { CustomerDashboard } from './components/customerDashboard/CustomerDashboard';
import { CustomerSettings } from './components/customerDashboard/Settings/Settings';
import { AddEmployees } from './components/adminDashboard/AddEmployees/AddEmployees';
import { GetEmployees } from './components/adminDashboard/GetEmployees/GetEmployees';
import { AddAgents } from './components/adminDashboard/AddAgents/AddAgents';
import { GetAgents } from './components/adminDashboard/GetAgents/GetAgents';
import { AddCustomers } from './components/adminDashboard/AddCustomers/AddCustomers';
import { GetCustomers } from './components/adminDashboard/GetCustomers/GetCustomers';
import { AddState } from './components/adminDashboard/AddState/AddState';
import { GetState } from './components/adminDashboard/GetState/GetState';
import { AddCity } from './components/adminDashboard/AddCity/AddCity';
import { GetCity } from './components/adminDashboard/GetCity/GetCity';
import { AddInsurance } from './components/adminDashboard/AddInsurance/AddInsurance';
import { GetInsurance } from './components/adminDashboard/GetInsurance/GetInsurance';
import { AddPolicy } from './components/adminDashboard/AddPolicy/AddPolicy';
import { GetPolicy } from './components/adminDashboard/GetPolicy/GetPolicy';
import { Commission } from './components/adminDashboard/Commission/Commission';
import { Claim } from './components/adminDashboard/Claim/Claim';
import { ViewOrUpdateRequests } from './components/adminDashboard/ViewOrUpdateRequests/ViewOrUpdateRequests';
import { Requests } from './components/adminDashboard/Requests/Requests';
import { Transactions } from './components/adminDashboard/Transactions/Transactions';
import { Feedback } from './components/adminDashboard/Feedback/Feedback';
import { Query } from './components/adminDashboard/Query/Query';
import { TaxSettings } from './components/adminDashboard/TaxSettings/TaxSettings';
import { InsuranceSettings } from './components/adminDashboard/InsuranceSettings/InsuranceSettings';
import { Settings } from './components/adminDashboard/Settings/Settings';
import { UpdateInsurance } from './components/adminDashboard/UpdateInsurance/UpdateInsurance';
import { DeleteInsurance } from './components/adminDashboard/DeleteInsurance/DeleteInsurance';
import { UpdateState } from './components/adminDashboard/UpdateState/UpdateState';
import { DeleteState } from './components/adminDashboard/DeleteState/DeleteState';
import { UpdateCity } from './components/adminDashboard/UpdateCity/UpdateCity';
import { DeleteCity } from './components/adminDashboard/DeleteCity/DeleteCity';
import { AddAdmin } from './components/adminDashboard/AddAdmin/AddAdmin';
import { UpdateQuery } from './components/adminDashboard/UpdateQuery/UpdateQuery';
import { DeleteQuery } from './components/adminDashboard/DeleteQuery/DeleteQuery';

import { ViewPolicy } from './components/adminDashboard/ViewPolicy/ViewPolicy';
import { UpdatePolicy } from './components/adminDashboard/UpdatePolicy/UpdatePolicy';
import { DeletePolicy } from './components/adminDashboard/DeletePolicy/DeletePolicy';
import { UpdateEmployee } from './components/adminDashboard/UpdateEmployee/UpdateEmployee';
import { DeleteEmployee } from './components/adminDashboard/DeleteEmployee/DeleteEmployee';
import { PolicyAccount } from './components/customerDashboard/PolicyAccount/PolicyAccount';
import { InsurancePolicy } from './components/customerDashboard/InsurancePolicy/InsurancePolicy';
import { AddFeedback } from './components/customerDashboard/Feedback/AddFeedback';
import { AddQuery } from './components/customerDashboard/AddQuery/AddQuery';
import { GetRequests } from './components/customerDashboard/GetRequests/GetRequests';
import { GetQuery } from './components/customerDashboard/GetQuery/GetQuery';
import { UpdateCustomerQuery } from './components/customerDashboard/UpdateCustomerQuery/UpdateCustomerQuery';
import { DeleteCustomerQuery } from './components/customerDashboard/DeleteCustomerQuery/DeleteCustomerQuery';
import { ViewPolicyAccount } from './components/customerDashboard/ViewPolicyAccount/ViewPolicyAccount';

import { AgentDashboard } from './components/agentDashboard/Dashboard/AgentDashboard';
import { AgentCustomers } from './components/agentDashboard/AllCustomers/AgentCustomers';
import { AffTransactions } from './components/agentDashboard/AllTransactions/AffTransactions';
import { AgentAccounts } from './components/agentDashboard/AllAccounts/AgentAccounts';
import { AgentCommissions } from './components/agentDashboard/AllCommissions/AgentCommissions';
import AgentBalance from './components/agentDashboard/AgentBalance/AgentBalance';
import AgentEmails from './components/agentDashboard/AgentEmails/AgentEmails';
import AgentProfile from './components/agentDashboard/AgentProfile/AgentProfile';
import { EmployeeDashboard } from './components/employeeDashboard/Dashboard/EmployeeDashboard';
import { Employee } from './components/employeeDashboard/Employee';
import { AllCustomers } from './components/employeeDashboard/AllCustomers/AllCustomers';
import { AllAgents } from './components/employeeDashboard/AllAgents/AllAgents';
import { AllAccounts } from './components/employeeDashboard/AllAccounts/AllAccounts';
import { RegisteredCustomers } from './components/employeeDashboard/RegisteredCustomers/RegisteredCustomers';
import { AllDocuments } from './components/employeeDashboard/AllDocuments/AllDocuments';
import { AllCommissions } from './components/employeeDashboard/AllCommissions/AllCommissions';
import { AllTransactions } from './components/employeeDashboard/Transactions/Transactions';
import { Agent } from './components/agentDashboard/Agent';
import PoliciesPage from './components/publicDashboard/PoliciesPage';
import PolicyDetailPage from './components/publicDashboard/PolicyDetailPage';
import UploadDocument from './components/customerDashboard/Documents/DocumentUpload';
import DocumentUpload from './components/customerDashboard/Documents/DocumentUpload';
import PasswordReset from './components/securityDashboard/PasswordChange/PasswordReset';

function App() {

  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>

      <Routes>

        {/* <Routes> */}
        <Route path='/' element={<PoliciesPage />}></Route>
        <Route path="/policy/:id" element={<PolicyDetailPage />} />

        <Route path='/login' element={<Login />}></Route>
        <Route path='/change-password' element={<PasswordReset />}></Route>
        <Route path='/register' element={<Register />}></Route>

        {/* </Routes> */}
        <Route element={<AdminDashboard />}>

            <Route path='/admin/policy/:id/view/:policyId' element={<ViewPolicy />}></Route>
            <Route path='/admin/policy/:id/edit/:policyId' element={<UpdatePolicy />}></Route>
            <Route path='/admin/policy/:id/delete/:policyId' element={<DeletePolicy />}></Route>
            <Route path='/admin/employee/:id/edit/:employeeId' element={<UpdateEmployee />}></Route>
            <Route path='/admin/employee/:id/delete/:employeeId' element={<DeleteEmployee />}></Route>
            <Route path='/admin/request/:id/view/:requestsId' element={<ViewOrUpdateRequests />}></Route>

          <Route path='/admin/dashboard/:id' element={<Dashboard />}></Route>
          <Route path='/admin/add-admin/:id' element={<AddAdmin />}></Route>
          <Route path='/admin/add-employees/:id' element={<AddEmployees />}></Route>
          <Route path='/admin/get-employees/:id' element={<GetEmployees />}></Route>
          <Route path='/admin/add-agents/:id' element={<AddAgents />}></Route>
          <Route path='/admin/get-agents/:id' element={<GetAgents />}></Route>
          <Route path='/admin/add-customers/:id' element={<AddCustomers />}></Route>
          <Route path='/admin/get-customers/:id' element={<AllCustomers />}></Route>
          <Route path='/admin/add-state/:id' element={<AddState />}></Route>
          <Route path='/admin/get-state/:id' element={<GetState />}></Route>
          <Route path='/admin/add-city/:id' element={<AddCity />}></Route>
          <Route path='/admin/get-city/:id' element={<GetCity />}></Route>
          <Route path='/admin/add-insurance-categories/:id' element={<AddInsurance />}></Route>
          <Route path='/admin/get-insurance-categories/:id' element={<GetInsurance />}></Route>
          <Route path='/admin/add-policy/:id' element={<AddPolicy />}></Route>
          <Route path='/admin/get-policy/:id' element={<GetPolicy />}></Route>
          <Route path='/admin/commission/:id' element={<Commission />}></Route>
          <Route path='/admin/claim/:id' element={<Claim />}></Route>
          <Route path='/admin/cancel/:id' element={<Cancel />}></Route>
          <Route path='/admin/requests/:id' element={<Requests />}></Route>
          <Route path='/admin/transactions/:id' element={<Transactions />}></Route>
          <Route path='/admin/feedback/:id' element={<Feedback />}></Route>
          <Route path='/admin/queries/:id' element={<Query />}></Route>
          <Route path='/admin/tax-settings/:id' element={<TaxSettings />}></Route>
          <Route path='/admin/insurance-settings/:id' element={<InsuranceSettings />}></Route>
          <Route path='/admin/settings/:id' element={<Settings />}></Route>
          <Route path='/admin/insurance-categories/:id/edit/:insuranceId' element={<UpdateInsurance />}></Route>
          <Route path='/admin/insurance-categories/:id/delete/:insuranceId' element={<DeleteInsurance />}></Route>
          <Route path='/admin/state/:id/edit/:stateId' element={<UpdateState />}></Route>
          <Route path='/admin/state/:id/delete/:stateId' element={<DeleteState />}></Route>
          <Route path='/admin/city/:id/edit/:cityId' element={<UpdateCity />}></Route>
          <Route path='/admin/city/:id/delete/:cityId' element={<DeleteCity />}></Route>
          <Route path='/admin/query/:id/edit/:queryId' element={<UpdateQuery />}></Route>
          <Route path='/admin/query/:id/delete/:queryId' element={<DeleteQuery />}></Route>

        </Route>
        <Route element={<Agent />}>
          <Route path='/agent/dashboard/:id' element={< AgentDashboard />}></Route>
          <Route path='/agent/customers/:id' element={<AgentCustomers />}></Route>
          <Route path='/agent/transactions/:id' element={<AffTransactions />}></Route>
          <Route path='/agent/accounts/:id' element={<AgentAccounts />}></Route>
          <Route path='/agent/commissions/:id' element={<AgentCommissions />}></Route>
          <Route path='/agent/balance/:id' element={<AgentBalance />}></Route>
          <Route path='/agent/email/:id' element={<AgentEmails />}></Route>
          <Route path='/agent/profile/:id' element={<AgentProfile />}></Route>

        </Route>
        <Route element={<Employee />}>

          <Route path='/employee/dashboard/:id' element={< EmployeeDashboard />}></Route>
          <Route path='/employee/customers/:id' element={<AllCustomers />}></Route>
          <Route path='/employee/agents/:id' element={<AllAgents />}></Route>
          <Route path='/employee/accounts/:id' element={<AllAccounts />}></Route>
          <Route path='/employee/registered-customers/:id' element={<RegisteredCustomers />}></Route>
          <Route path='/employee/all-documents/:id' element={<AllDocuments />}></Route>
          <Route path='/employee/commissions/:id' element={<AllCommissions />}></Route>
          <Route path='/employee/transactions/:id' element={<AllTransactions />}></Route>

        </Route>

        <Route element={<CustomerDashboard />}>

          <Route path='/user/transactions/:id' element={<MakeTransactions />}></Route>
          <Route path='/user/passbook/:id' element={<Passbook />}></Route>
          <Route path='/user/accounts/:id' element={<Accounts />}></Route>
          <Route path='/user/settings/:id' element={<CustomerSettings />}></Route>
          <Route path='/user/documents/upload' element={<DocumentUpload />}></Route>
          <Route path='/user/dashboard/:id' element={<DocumentUpload />}></Route>

                      <Route path='/customer/policy-account/:id' element={<PolicyAccount />}></Route>
                      <Route path='/customer/insurance/:id/type/:insuranceId' element={<InsurancePolicy />}></Route>
                      <Route path='/customer/feedback/:id' element={<AddFeedback />}></Route>
                      <Route path='/customer/add-query/:id' element={<AddQuery />}></Route>
                      <Route path='/customer/query/:id' element={<GetQuery />}></Route>
                      <Route path='/customer/query/:id/edit/:queryId' element={<UpdateCustomerQuery />}></Route>
                      <Route path='/customer/query/:id/delete/:queryId' element={<DeleteCustomerQuery />}></Route>
                      <Route path='/customer/requests/:id' element={<GetRequests />}></Route>
                      <Route path='/customer/settings/:id' element={<CustomerSettings />}></Route>
                      <Route path='/customer/policy-account/:id/view/:policyAccountId' element={<ViewPolicyAccount />}></Route>

                    </Route>

        </Route>

      </Routes>


      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
      >
        <img
          className="theme-icon"
          src={theme === "light" ? SunIcon : MoonIcon}
        />
      </button>


    </>
  );
}

export default App;
