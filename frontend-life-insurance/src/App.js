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
import { MakeTransactions } from './components/customerDashboard/MakeTransactions/MakeTransactions';
import { Passbook } from './components/customerDashboard/Passbook/Passbook';
import { Accounts } from './components/customerDashboard/Accounts/Accounts';
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
import { Cancel } from './components/adminDashboard/Cancel/Cancel';
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

          <Route element={<SecurityDashboard/>}>

            <Route path='/auth/login' element={<Login/>}></Route>
            <Route path='/auth/register' element={<Register/>}></Route>

          </Route>
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
            <Route path='/admin/cancel/:id' element={<Cancel />}></Route>
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

          </Route>

          <Route element={<CustomerDashboard />}>

            <Route path='/user/transactions/:id' element={<MakeTransactions />}></Route>
            <Route path='/user/passbook/:id' element={<Passbook />}></Route>
            <Route path='/user/accounts/:id' element={<Accounts />}></Route>
            <Route path='/user/settings/:id' element={<CustomerSettings />}></Route>
            
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
