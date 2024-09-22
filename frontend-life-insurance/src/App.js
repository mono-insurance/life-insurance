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

function App() {

  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const showButton = location.pathname.startsWith('/admin');

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

          <Route element={<SecurityDashboard/>}>

            <Route path='/suraksha/login' element={<Login/>}></Route>
            <Route path='/suraksha/register' element={<Register/>}></Route>

          </Route>

        </Routes>


        <div>
            <Routes>
              
              <Route element={<AdminDashboard />}>

                <Route path='/admin/dashboard/:id' element={<Dashboard />}></Route>
                <Route path='/admin/add-admin/:id' element={<AddAdmin />}></Route>
                <Route path='/admin/add-employees/:id' element={<AddEmployees />}></Route>
                <Route path='/admin/get-employees/:id' element={<GetEmployees />}></Route>
                <Route path='/admin/add-agents/:id' element={<AddAgents />}></Route>
                <Route path='/admin/get-agents/:id' element={<GetAgents />}></Route>
                <Route path='/admin/add-customers/:id' element={<AddCustomers />}></Route>
                <Route path='/admin/get-customers/:id' element={<GetCustomers />}></Route>
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
                <Route path='/admin/requests/:id' element={<Requests />}></Route>
                <Route path='/admin/transactions/:id' element={<Transactions />}></Route>
                <Route path='/admin/feedback/:id' element={<Feedback />}></Route>
                <Route path='/admin/queries/:id' element={<Query/>}></Route>
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
                <Route path='/admin/policy/:id/view/:policyId' element={<ViewPolicy />}></Route>
                <Route path='/admin/policy/:id/edit/:policyId' element={<UpdatePolicy />}></Route>
                <Route path='/admin/policy/:id/delete/:policyId' element={<DeletePolicy />}></Route>
                <Route path='/admin/employee/:id/edit/:employeeId' element={<UpdateEmployee />}></Route>
                <Route path='/admin/employee/:id/delete/:employeeId' element={<DeleteEmployee />}></Route>
                <Route path='/admin/request/:id/view/:requestsId' element={<ViewOrUpdateRequests />}></Route>

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
