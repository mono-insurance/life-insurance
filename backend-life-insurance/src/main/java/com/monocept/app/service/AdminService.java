package com.monocept.app.service;

import java.time.LocalDate;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CityDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.dto.StateDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.utils.PagedResponse;

import com.monocept.app.dto.InsuranceTypeDTO;

public interface AdminService {

    AdminDTO getAdminProfile();

    AdminDTO makeAnotherAdmin(CredentialsDTO credentials);

    AdminDTO updateAdminProfile(AdminDTO adminDTO);

    EmployeeDTO createEmployee(CredentialsDTO credentials);

//	EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);

    void deleteEmployee(Long id);

    StateDTO addState(StateDTO stateDTO);


    void deleteState(Long id);

    CityDTO addCity(CityDTO cityDTO);


    void deleteCity(Long id);

    InsuranceTypeDTO addInsuranceType(InsuranceTypeDTO insuranceTypeDTO);

    InsuranceTypeDTO updateInsuranceType(Long id, InsuranceTypeDTO insuranceTypeDTO);

    void deleteInsuranceType(Long id);

    PolicyDTO addPolicy(PolicyDTO policyDTO);

    PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);

    void deletePolicy(Long id);

    PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction);

    SettingsDTO addOrUpdateSetting(SettingsDTO settingDTO);

    SettingsDTO getSetting(String settingKey);

    PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction);

    PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction);

    PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction);


    void deleteQuery(Long id);


    Boolean approveAgent(Long agentId);
}
