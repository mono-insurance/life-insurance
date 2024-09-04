package com.monocept.app.service;

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

	PolicyAccount convertPolicyAccountDtoToPolicyAccount(PolicyAccountDTO policyAccountDTO);
	
	PolicyAccountDTO convertPolicyAccountToPolicyAccountDTO(PolicyAccount policyAccount);
	

}
