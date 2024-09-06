package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.utils.PageResult;

import java.util.List;
import java.util.Set;
import java.util.List;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CityDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.CredentialsResponseDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.DocumentNeededDTO;
import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.dto.StateDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.entity.Employee;
import com.monocept.app.entity.Feedback;
import com.monocept.app.entity.InsuranceType;
import com.monocept.app.entity.Policy;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Query;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.State;
import com.monocept.app.entity.Transactions;

public interface DtoService {
	
    AdminDTO converAdminToAdminResponseDTO(Admin admin);
    
    CredentialsResponseDTO convertEntityToCredentialsDTO(Credentials credentials);

	Credentials convertCredentialsDtoToCredentials(CredentialsDTO credentialsDTO);

	EmployeeDTO converEmployeeToEmployeeResponseDTO(Employee employee);

	Employee convertEmployeeDtoToEntity(EmployeeDTO employeeDTO);

	State convertStateDtoToEntity(StateDTO stateDTO);

	StateDTO convertStateToStateDTO(State savedState);

	City convertCityDtoToEntity(CityDTO cityDTO);

	CityDTO convertCityToDTO(City savedCity);

	InsuranceType convertInsuranceTypeDtoToEntity(InsuranceTypeDTO insuranceTypeDTO);

	InsuranceTypeDTO convertInsuranceTypeToDTO(InsuranceType savedInsuranceType);

	Policy convertPolicyDtoToEntity(PolicyDTO policyDTO);

	PolicyDTO convertPolicyToDTO(Policy savedPolicy);

	DocumentUploaded convertDocumentUploadedDtoToEntity(DocumentUploadedDTO documentUploaded);

	DocumentNeeded convertDocumentNeededDtoToEntity(DocumentNeededDTO dto);

	List<StateDTO> convertStateListEntityToDTO(List<State> allStates);

	List<CityDTO> convertCityListEntityToDTO(List<City> allCities);

	List<InsuranceTypeDTO> convertInsuranceTypeListEntityToDTO(List<InsuranceType> allInsuranceTypes);

	List<PolicyDTO> convertPolicyListEntityToDTO(List<Policy> allPolicies);

	Settings convertSettingsDtoToSettings(SettingsDTO settingDTO);

	SettingsDTO convertSettingsToSettingsDTO(Settings settings);

	List<EmployeeDTO> convertEmployeeListEntityToDTO(List<Employee> allEmployees);

	QueryDTO convertQueryToQueryDTO(Query updatedQuery);

	List<QueryDTO> convertQueryListEntityToDTO(List<Query> allQueries);

	List<TransactionsDTO> convertTransactionListEntityToDTO(List<Transactions> allTransactions);

	CustomerDTO convertCustomerToCustomerResponseDTO(Customer customer);

	Address convertAddressDTOToEntity(AddressDTO address);

	AddressDTO convertEntityToAddressDTO(Address currentAddress);

	Query convertQueryDTOToEntity(QueryDTO queryDTO);

	Feedback convertFeedbackDTOToEntity(FeedbackDTO feedbackDTO);

	FeedbackDTO convertFeedbackToFeedbackDTO(Feedback savedFeedback);

	List<FeedbackDTO> convertFeedbackListEntityToDTO(List<Feedback> allFeedbacks);

	List<PolicyAccountDTO> convertPolicyAccountListEntityToDTO(List<PolicyAccount> allPolicyAccounts);


	AdminDTO convertToAdminResponseDTO(Admin admin);

	Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO);

	Customer convertCustomerDtoToCustomer(RegistrationDTO registrationDTO);

    Agent convertAgentDtoToAgent(AgentDTO agentDTO);

    AgentDTO convertAgentToAgentDto(Agent agent);
    AddressDTO convertAddressToDto(Address address);

    Address convertDtoToAddress(AddressDTO addressDTO);

    void updateCityAndState(Address agentAddress, AddressDTO address);

    Credentials convertCredentialResponseDtoToCredentials(Credentials credentials, CredentialsResponseDTO credentials1);

    PageResult convertToPage(List<PolicyAccount> policyAccountList, int pageNo, String sort, String sortBy, String sortDirection, int size);

    List<PolicyAccountDTO> convertPolicyAccountsToDto(List<PolicyAccount> policyAccounts);

    PageResult convertWithdrawalsToPage(List<WithdrawalRequests> withdrawalRequests, int pageNo, String sort, String sortBy, String sortDirection, int size);

    List<WithdrawalRequestsDTO> convertWithdrawalsToDto(List<WithdrawalRequests>  content);

    PageResult convertCustomersToPage(List<Customer> customerList, int pageNo, String sort, String sortBy, String sortDirection, int size);


    List<CustomerDTO> convertCustomersToDto(List<Customer> content);

    EmployeeDTO convertEmployeeToDTO(Employee employee);

	PolicyAccount convertPolicyAccountDtoToPolicyAccount(PolicyAccountDTO policyAccountDTO);
	
	PolicyAccountDTO convertPolicyAccountToPolicyAccountDTO(PolicyAccount policyAccount);
	


    List<AgentDTO> convertAgentsToDto(List<Agent> agents);

    List<DocumentNeededDTO> convertDocumentNeededToDto(List<DocumentNeeded> documentNeededs);
}
