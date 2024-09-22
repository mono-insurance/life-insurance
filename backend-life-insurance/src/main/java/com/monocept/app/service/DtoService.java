package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.utils.PageResult;

import java.util.List;
import java.util.Set;
import java.util.List;

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
	TransactionsDTO convertTransactionEntityToDTO(Transactions transaction);

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

	Customer convertCustomerDtoToCustomer(CustomerDTO registrationDTO);

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

	List<SettingsDTO> convertSettingsListEntityToDTO(List<Settings> allSettings);

	WithdrawalRequestsDTO convertWithdrawalRequestToDTO(WithdrawalRequests withdrawalRequest);

	List<WithdrawalRequestsDTO> convertWithdrawalRequestsListEntityToDTO(
			List<WithdrawalRequests> allWithdrawalRequests);

    List<DocumentUploadedDTO> convertDocumentsToDTO(List<DocumentUploaded> allDocuments);
	AdminCreationDTO converAdminToAdminCreationDTO(Admin updatedAdmin);


	EmployeeCreationDTO convertEmployeeToEmployeeCreationDTO(Employee existingEmployee);

	CustomerCreationDTO convertCustomerToCustomerCreationDTO(Customer customer);

	List<UserDTO> convertCredentialsListEntityToUserDTO(List<Credentials> allCredentials);

	UserDTO convertCredentialsEntityToUserDTO(Credentials credentials);

	List<CommissionDTO> convertPolicyAccountListEntityToCommissionDTO(List<PolicyAccount> allPolicyAccount);

	CommissionDTO convertPolicyAccountEntityToCommissionDTO(PolicyAccount policyAccount);

	List<CommissionDTO> convertTransactionListEntityToCommissionDTO(List<Transactions> allTransactions);

	CommissionDTO convertTransactionEntityToCommissionDTO(Transactions transactions);

	PageResult convertTransactionsToPage(List<Transactions> transactions, int pageNo, String sort, String sortBy, String sortDirection, int size);

	DocumentUploadedDTO convertDocumentUploadedToDTO(DocumentUploaded documentUploaded);
	List<DocumentUploadedDTO> convertDocumentUploadedListToDTO(List<DocumentUploaded> documents);
}
