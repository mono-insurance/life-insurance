package com.monocept.app.service;

import java.util.List;

import com.monocept.app.dto.*;
import com.monocept.app.entity.Agent;
import com.monocept.app.utils.PagedResponse;

import jakarta.validation.Valid;


public interface AdminService {

	AdminCreationDTO getAdminProfile();

    AdminDTO makeAnotherAdmin(AdminCreationDTO adminCreationDTO);

    AdminCreationDTO updateAdminProfile(AdminCreationDTO adminDTO);


    EmployeeDTO createEmployee(CredentialsDTO credentials);

    void deleteEmployee(Long id);

    StateDTO addState(StateDTO stateDTO);


    void deleteState(Long id);

    CityDTO addCity(CityDTO cityDTO);


    void deleteCity(Long id);

    InsuranceTypeDTO addInsuranceType(InsuranceTypeDTO insuranceTypeDTO);

    InsuranceTypeDTO updateInsuranceType(Long id, InsuranceTypeDTO insuranceTypeDTO);

    void deleteInsuranceType(Long id);


    PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);

    void deletePolicy(Long id);

    PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction);

    SettingsDTO addOrUpdateSetting(SettingsDTO settingDTO);

    SettingsDTO getSetting(String settingKey);

    PagedResponse<AgentDTO> getAllRegisteredAgents(int page, int size, String sortBy, String direction);

    PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction);

    PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction);


    void deleteQuery(Long id);


    List<InsuranceTypeDTO> getInsuranceTypes();

	SystemCounts wholeSystemStats();

	PagedResponse<UserDTO> getNewUsers(int page, int size, String sortBy, String direction);
}
