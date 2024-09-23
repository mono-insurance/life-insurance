import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
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
import { AddFeedback } from './components/customerDashboard/Feedback/AddFeedback';
import { AddQuery } from './components/customerDashboard/AddQuery/AddQuery';
import { GetRequests } from './components/customerDashboard/GetRequests/GetRequests';
import { GetQuery } from './components/customerDashboard/GetQuery/GetQuery';
import { UpdateCustomerQuery } from './components/customerDashboard/UpdateCustomerQuery/UpdateCustomerQuery';
import { DeleteCustomerQuery } from './components/customerDashboard/DeleteCustomerQuery/DeleteCustomerQuery';
import { ViewPolicyAccount } from './components/customerDashboard/ViewPolicyAccount/ViewPolicyAccount';
import { Products } from './components/websiteStructure/Products/Products';
import { Policy } from './components/websiteStructure/Policy/Policy';
import { Profile } from './components/customerDashboard/Profile/Profile';
import { PaymentSuccess } from './components/customerDashboard/PaymentSuccess/PaymentSuccess';
import { PaymentFailure } from './components/customerDashboard/PaymentFailure/PaymentFailure';
import HomePage from './components/websiteStructure/HomePage/HomePage';
import { PolicyAccounts } from './components/adminDashboard/PolicyAccounts/PolicyAccounts';
import { Documents } from './components/adminDashboard/Documents/Documents';
import PasswordReset from './components/securityDashboard/PasswordReset/PasswordReset';
import { Agent } from './components/agentDashboard/Agent';
import { AgentDashboard } from './components/agentDashboard/Dashboard/AgentDashboard';
import { AgentCustomers } from './components/agentDashboard/AllCustomers/AgentCustomers';
import { AffTransactions } from './components/agentDashboard/AllTransactions/AffTransactions';
import { AgentAccounts } from './components/agentDashboard/AllAccounts/AgentAccounts';
import { AgentCommissions } from './components/agentDashboard/AllCommissions/AgentCommissions';
import AgentBalance from './components/agentDashboard/AgentBalance/AgentBalance';
import AgentEmails from './components/agentDashboard/AgentEmails/AgentEmails';
import AgentProfile from './components/agentDashboard/AgentProfile/AgentProfile';
import { ViewAgentPolicyAccount } from './components/agentDashboard/ViewPolicyAccount/ViewPolicyAccount';
import { AgentCustomerProfile } from './components/agentDashboard/CustomerProfile/AgentCustomerProfile';
import { Employee } from './components/employeeDashboard/Employee';
import { EmployeeDashboard } from './components/employeeDashboard/Dashboard/EmployeeDashboard';
import { AllCustomers } from './components/employeeDashboard/AllCustomers/AllCustomers';
import { AllAgents } from './components/employeeDashboard/AllAgents/AllAgents';
import { AllAccounts } from './components/employeeDashboard/AllAccounts/AllAccounts';
import { ViewEmpPolicyAccount } from './components/employeeDashboard/ViewPolicyAccount/ViewPolicyAccount';
import { EmpCommission } from './components/employeeDashboard/Commission/Commission';
import { RegisteredCustomers } from './components/employeeDashboard/RegisteredCustomers/RegisteredCustomers';
import { AllDocuments } from './components/employeeDashboard/AllDocuments/AllDocuments';
import SingleDocument from './components/employeeDashboard/AllDocuments/SingleDocument';
import { AllCommissions } from './components/employeeDashboard/AllCommissions/AllCommissions';
import { AllTransactions } from './components/employeeDashboard/Transactions/Transactions';
import { GetEmpState } from './components/employeeDashboard/GetEmpState/GetEmpState';
import { GetEmpCity } from './components/employeeDashboard/GetEmpCity/GetCity';
import { UpdateEmpState } from './components/employeeDashboard/UpdateState/UpdateState';
import { UpdateEmpCity } from './components/employeeDashboard/UpdateCity/UpdateCity';
import { UpdateEmpQuery } from './components/employeeDashboard/UpdateQuery/UpdateQuery';
import { DeleteEmpQuery } from './components/employeeDashboard/DeleteQuery/DeleteQuery';
import { EmpFeedback } from './components/employeeDashboard/Feedback/Feedback';
import { EmpQuery } from './components/employeeDashboard/Query/Query';

function App() {

  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const showButton = location.pathname.startsWith('/suraksha/admin');

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <div className='mx-20 sm:mx-[10%]'>
        <Routes>
          <Route element={<CustomerDashboard />}>
            <Route
              path="/"
              element={<HomePage />}
            />
          </Route>
        </Routes>
      </div>
      <div className='mx-20 sm:mx-[10%]'>
        <Routes>
          <Route element={<CustomerDashboard />}>
            <Route path='/suraksha/customer/add-query' element={<AddQuery />}></Route>
            <Route path='/suraksha/customer/query' element={<GetQuery />}></Route>
            <Route path='/suraksha/customer/query/edit/:queryId' element={<UpdateCustomerQuery />}></Route>
            <Route path='/suraksha/customer/query/delete/:queryId' element={<DeleteCustomerQuery />}></Route>
            <Route path='/suraksha/customer/feedback' element={<AddFeedback />}></Route>
            <Route path='/suraksha/customer/requests' element={<GetRequests />}></Route>
            <Route path='/suraksha/payment-failure' element={<PaymentFailure />}></Route>
            <Route path='/suraksha/payment-success' element={<PaymentSuccess />}></Route>
            <Route path='/suraksha/customer/policy-account' element={<PolicyAccount />}></Route>
            <Route path='/suraksha/customer/profile' element={<Profile />}></Route>
            <Route path='/suraksha/customer/policy-account/view/:policyAccountId' element={<ViewPolicyAccount />}></Route>
            <Route path='/suraksha/home' element={<HomePage />}></Route>
            <Route path='/suraksha/scheme/:policyId' element={<Policy />}></Route>
            <Route path='/suraksha/insurances' element={<Products />}></Route>
            <Route path='/suraksha/insurances/:insuranceType' element={<Products />}></Route>
          </Route>
        </Routes>
      </div>

      <Routes>

        <Route element={<SecurityDashboard />}>

          <Route path='/suraksha/login' element={<Login />}></Route>
          <Route path='/suraksha/register' element={<Register />}></Route>
          <Route path='/suraksha/password-reset' element={<PasswordReset />}></Route>

        </Route>

      </Routes>


      <div>
        <Routes>

          <Route element={<AdminDashboard />}>
            <Route path='/suraksha/admin/dashboard/:id' element={<Dashboard />}></Route>
            <Route path='/suraksha/admin/add-admin/:id' element={<AddAdmin />}></Route>
            <Route path='/suraksha/admin/employee/:id/edit/:employeeId' element={<UpdateEmployee />}></Route>
            <Route path='/suraksha/admin/employee/:id/delete/:employeeId' element={<DeleteEmployee />}></Route>
            <Route path='/suraksha/admin/add-employees/:id' element={<AddEmployees />}></Route>
            <Route path='/suraksha/admin/get-employees/:id' element={<GetEmployees />}></Route>
            <Route path='/suraksha/admin/add-agents/:id' element={<AddAgents />}></Route>
            <Route path='/suraksha/admin/add-state/:id' element={<AddState />}></Route>
            <Route path='/suraksha/admin/get-state/:id' element={<GetState />}></Route>
            <Route path='/suraksha/admin/state/:id/edit/:stateId' element={<UpdateState />}></Route>
            <Route path='/suraksha/admin/state/:id/delete/:stateId' element={<DeleteState />}></Route>
            <Route path='/suraksha/admin/add-city/:id' element={<AddCity />}></Route>
            <Route path='/suraksha/admin/get-city/:id' element={<GetCity />}></Route>
            <Route path='/suraksha/admin/city/:id/edit/:cityId' element={<UpdateCity />}></Route>
            <Route path='/suraksha/admin/city/:id/delete/:cityId' element={<DeleteCity />}></Route>
            <Route path='/suraksha/admin/add-insurance-categories/:id' element={<AddInsurance />}></Route>
            <Route path='/suraksha/admin/get-insurance-categories/:id' element={<GetInsurance />}></Route>
            <Route path='/suraksha/admin/insurance-categories/:id/edit/:insuranceId' element={<UpdateInsurance />}></Route>
            <Route path='/suraksha/admin/insurance-categories/:id/delete/:insuranceId' element={<DeleteInsurance />}></Route>
            <Route path='/suraksha/admin/add-policy/:id' element={<AddPolicy />}></Route>
            <Route path='/suraksha/admin/get-policy/:id' element={<GetPolicy />}></Route>
            <Route path='/suraksha/admin/policy/:id/view/:policyId' element={<ViewPolicy />}></Route>
            <Route path='/suraksha/admin/policy/:id/edit/:policyId' element={<UpdatePolicy />}></Route>
            <Route path='/suraksha/admin/policy/:id/delete/:policyId' element={<DeletePolicy />}></Route>
            <Route path='/suraksha/admin/tax-settings/:id' element={<TaxSettings />}></Route>
            <Route path='/suraksha/admin/insurance-settings/:id' element={<InsuranceSettings />}></Route>
            <Route path='/suraksha/admin/feedback/:id' element={<Feedback />}></Route>
            <Route path='/suraksha/admin/queries/:id' element={<Query />}></Route>
            <Route path='/suraksha/admin/query/:id/edit/:queryId' element={<UpdateQuery />}></Route>
            <Route path='/suraksha/admin/query/:id/delete/:queryId' element={<DeleteQuery />}></Route>
            <Route path='/suraksha/admin/commission/:id' element={<Commission />}></Route>
            <Route path='/suraksha/admin/claim/:id' element={<Claim />}></Route>
            <Route path='/suraksha/admin/requests/:id' element={<Requests />}></Route>
            <Route path='/suraksha/admin/request/:id/view/:requestsId' element={<ViewOrUpdateRequests />}></Route>
            <Route path='/suraksha/admin/transactions/:id' element={<Transactions />}></Route>
            <Route path='/suraksha/admin/profile/:id' element={<Settings />}></Route>
            <Route path='/suraksha/admin/policy-accounts/:id' element={<PolicyAccounts />}></Route>
            <Route path='/suraksha/admin/documents/:id' element={<Documents />}></Route>
            <Route path='/suraksha/admin/get-agents/:id' element={<GetAgents />}></Route>
            <Route path='/suraksha/admin/add-customers/:id' element={<AddCustomers />}></Route>
            <Route path='/suraksha/admin/get-customers/:id' element={<GetCustomers />}></Route>

          </Route>

          <Route element={<Agent />}>
            <Route path='/agent/dashboard/:aid' element={< AgentDashboard />}></Route>
            <Route path='/agent/customers/:aid' element={<AgentCustomers />}></Route>
            <Route path='/agent/transactions/:aid' element={<AffTransactions />}></Route>
            <Route path='/agent/accounts/:aid' element={<AgentAccounts />}></Route>
            <Route path='/agent/commissions/:aid' element={<AgentCommissions />}></Route>
            <Route path='/agent/balance/:aid' element={<AgentBalance />}></Route>
            <Route path='/agent/email/:aid' element={<AgentEmails />}></Route>
            <Route path='/agent/profile/:aid' element={<AgentProfile />}></Route>
            <Route path='/agent/policy-account/:aid/view/:policyAccountId' element={<ViewAgentPolicyAccount />}></Route>
            <Route path='/agent/:aid/customer/settings/:customerId' element={<AgentCustomerProfile />}></Route>

          </Route>
          <Route element={<Employee />}>

            <Route path='/employee/dashboard/:id' element={< EmployeeDashboard />}></Route>
            <Route path='/employee/customers/:id' element={<AllCustomers />}></Route>
            <Route path='/employee/agents/:id' element={<AllAgents />}></Route>
            <Route path='/employee/accounts/:id' element={<AllAccounts />}></Route>
            <Route path='/employee/policy-account/:id/view/:policyAccountId' element={<ViewEmpPolicyAccount />}></Route>
            <Route path='/employee/commission/:id' element={<EmpCommission />}></Route>
            <Route path='/employee/registered-customers/:id' element={<RegisteredCustomers />}></Route>
            <Route path='/employee/all-documents/:id' element={<AllDocuments />}></Route>
            <Route path='/employee/:id/document/:documentId' element={<SingleDocument />}></Route>
            <Route path='/employee/withdrawals/:id' element={<AllCommissions />}></Route>
            <Route path='/employee/transactions/:id' element={<AllTransactions />}></Route>
            <Route path='/employee/:id/customer/settings/:customerId' element={<AgentCustomerProfile />}></Route>
            <Route path='/employee/:id/agent/profile/:aid' element={<AgentProfile />}></Route>
            <Route path='/employee/get-state/:id' element={<GetEmpState />}></Route>
            <Route path='/employee/get-city/:id' element={<GetEmpCity />}></Route>
            <Route path='/employee/state/:id/edit/:stateId' element={<UpdateEmpState />}></Route>
            <Route path='/employee/city/:id/edit/:cityId' element={<UpdateEmpCity />}></Route>
            <Route path='/employee/query/:id/edit/:queryId' element={<UpdateEmpQuery />}></Route>
            <Route path='/employee/query/:id/delete/:queryId' element={<DeleteEmpQuery />}></Route>
            <Route path='/employee/feedback/:id' element={<EmpFeedback />}></Route>
            <Route path='/employee/queries/:id' element={<EmpQuery />}></Route>

          </Route>


        </Routes>

        {showButton && (
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
          >
            <img
              className="theme-icon"
              src={theme === "light" ? SunIcon : MoonIcon}
              alt="Toggle Theme"
            />
          </button>
        )}
      </div>

    </>
  );
}

export default App;
