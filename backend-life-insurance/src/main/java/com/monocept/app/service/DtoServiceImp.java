package com.monocept.app.service;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.AgentDTO;
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
import com.monocept.app.entity.*;
import com.monocept.app.repository.RoleRepository;
import com.monocept.app.utils.GlobalSettings;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DtoServiceImp implements DtoService{
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private RoleRepository roleRepository;

    @Override
    public AdminDTO converAdminToAdminResponseDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        
        adminDTO.setAdminId(admin.getAdminId());
        adminDTO.setFirstName(admin.getFirstName());
        adminDTO.setLastName(admin.getLastName());
        adminDTO.setCredentials(convertEntityToCredentialsDTO(admin.getCredentials()));
        
        return adminDTO;
    }
    
	@Override
	public EmployeeDTO converEmployeeToEmployeeResponseDTO(Employee employee) {
		EmployeeDTO employeeDTO = new EmployeeDTO();
	    employeeDTO.setEmployeeId(employee.getEmployeeId());
	    employeeDTO.setFirstName(employee.getFirstName());
	    employeeDTO.setLastName(employee.getLastName());
	    employeeDTO.setDateOfBirth(employee.getDateOfBirth());
	    employeeDTO.setQualification(employee.getQualification());
	    employeeDTO.setIsActive(employee.getIsActive());
	    employeeDTO.setCredentials(convertEntityToCredentialsDTO(employee.getCredentials()));
	    return employeeDTO;
	}
    
    @Override
    public CredentialsResponseDTO convertEntityToCredentialsDTO(Credentials credentials) {
    	CredentialsResponseDTO credentialsDTO = new CredentialsResponseDTO();
        
        credentialsDTO.setId(credentials.getId());
        credentialsDTO.setUsername(credentials.getUsername());
        credentialsDTO.setEmail(credentials.getEmail());
        credentialsDTO.setMobileNumber(credentials.getMobileNumber());
        credentialsDTO.setRole(credentials.getRole().getName());
        return credentialsDTO;
    }
    
    

	@Override
	public Credentials convertCredentialsDtoToCredentials(CredentialsDTO credentialsDTO) {
		Credentials credentials = new Credentials();
		credentials.setId(credentialsDTO.getId());
	    credentials.setUsername(credentialsDTO.getUsername());
	    credentials.setEmail(credentialsDTO.getEmail());
	    credentials.setPassword(passwordEncoder.encode(credentialsDTO.getPassword()));
	    credentials.setMobileNumber(credentialsDTO.getMobileNumber());
	    

	    
    	if ("Admin".equalsIgnoreCase(credentialsDTO.getRole())) {
    	    Role role = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
        	credentials.setRole(role);
        	
            Admin admin = convertAdminDtoToAdmin(credentialsDTO.getAdminDTO());
            admin.setCredentials(credentials);
            credentials.setAdmin(admin);
        }

        if ("Employee".equalsIgnoreCase(credentialsDTO.getRole())) {
        	
    	    Role role = roleRepository.findByName("ROLE_EMPLOYEE")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
        	credentials.setRole(role);
        	
            Employee employee = convertEmployeeDtoToEmployee(credentialsDTO.getEmployeeDTO());
            employee.setCredentials(credentials);
            credentials.setEmployee(employee);
        }

        if ("Agent".equalsIgnoreCase(credentialsDTO.getRole())) {
    	    Role role = roleRepository.findByName("ROLE_AGENT")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
        	credentials.setRole(role);
        	
            Agent agent = convertAgentDtoToAgent(credentialsDTO.getAgentDTO());
            agent.setCredentials(credentials);
            credentials.setAgent(agent);
        }

        if ("Customer".equalsIgnoreCase(credentialsDTO.getRole())) {
    	    Role role = roleRepository.findByName("ROLE_CUSTOMER")
                    .orElseThrow(() -> new RuntimeException("Role admin not found"));
        	credentials.setRole(role);
        	
            Customer customer = convertCustomerDtoToCustomer(credentialsDTO.getCustomerDTO());
            customer.setCredentials(credentials);
            credentials.setCustomer(customer);
        }
	    
	    
	    return credentials;
	}
	


	private Admin convertAdminDtoToAdmin(AdminDTO adminDTO) {
		Admin admin = new Admin();
		admin.setAdminId(adminDTO.getAdminId());
	    admin.setFirstName(adminDTO.getFirstName());
	    admin.setLastName(adminDTO.getLastName());
	    
	    return admin;
	}
    
	private Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
		Employee employee = new Employee();
		employee.setEmployeeId(employeeDTO.getEmployeeId());
	    employee.setFirstName(employeeDTO.getFirstName());
	    employee.setLastName(employeeDTO.getLastName());
	    employee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    employee.setQualification(employeeDTO.getQualification());
	    employee.setIsActive(employeeDTO.getIsActive());
	    
	    return employee;
	}
	

    
	private Agent convertAgentDtoToAgent(AgentDTO agentDTO) {
		return null;
	}


	private Customer convertCustomerDtoToCustomer(CustomerDTO customerDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Employee convertEmployeeDtoToEntity(EmployeeDTO employeeDTO) {
		Employee employee = new Employee();
	    employee.setFirstName(employeeDTO.getFirstName());
	    employee.setLastName(employeeDTO.getLastName());
	    employee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    employee.setQualification(employeeDTO.getQualification());
	    employee.setIsActive(employeeDTO.getIsActive());
	    employee.setCredentials(convertCredentialsDtoToEntity(employeeDTO.getCredentials()));
	    return employee;
	}

	private Credentials convertCredentialsDtoToEntity(CredentialsResponseDTO credentialsResponseDTO) {
		Credentials credentials = new Credentials();
	    credentials.setUsername(credentialsResponseDTO.getUsername());
	    credentials.setEmail(credentialsResponseDTO.getEmail());
	    credentials.setMobileNumber(credentialsResponseDTO.getMobileNumber());
	    
	    return credentials;
	}

	@Override
	public State convertStateDtoToEntity(StateDTO stateDTO) {
		State state = new State();
	    state.setStateId(stateDTO.getStateId());
	    state.setStateName(stateDTO.getStateName());
	    state.setIsActive(stateDTO.getIsActive());
	    
	    if (stateDTO.getCities() != null && !stateDTO.getCities().isEmpty()) {
	        List<City> cities = stateDTO.getCities().stream()
	            .map(this::convertCityDtoToEntity)
	            .collect(Collectors.toList());
	        state.setCities(cities);
	    }
	    
	    return state;
	}

	@Override
	public City convertCityDtoToEntity(CityDTO cityDTO) {
	    City city = new City();
	    city.setCityId(cityDTO.getCityId());
	    city.setCityName(cityDTO.getCityName());
	    city.setIsActive(cityDTO.getIsActive());
	    

	    return city;
	}

	@Override
	public StateDTO convertStateToStateDTO(State state) {
		StateDTO stateDTO = new StateDTO();
        stateDTO.setStateId(state.getStateId());
        stateDTO.setStateName(state.getStateName());
        stateDTO.setIsActive(state.getIsActive());
        
        if (state.getCities() != null && !state.getCities().isEmpty()) {
        	List<CityDTO> cityDTOs = state.getCities().stream()
                    .map(this::convertCityToDTO)
                    .collect(Collectors.toList());
        	stateDTO.setCities(cityDTOs);
	    }
        
        return stateDTO;
	}

	@Override
	public CityDTO convertCityToDTO(City city) {
        CityDTO cityDTO = new CityDTO();
        cityDTO.setCityId(city.getCityId());
        cityDTO.setCityName(city.getCityName());
        cityDTO.setIsActive(city.getIsActive());
        cityDTO.setStateId(city.getState().getStateId());

        return cityDTO;
    }

	@Override
	public InsuranceType convertInsuranceTypeDtoToEntity(InsuranceTypeDTO insuranceTypeDTO) {
		InsuranceType insuranceType = new InsuranceType();
        insuranceType.setTypeId(insuranceTypeDTO.getTypeId());
        insuranceType.setInsuranceCategory(insuranceTypeDTO.getInsuranceCategory());
        insuranceType.setIsActive(insuranceTypeDTO.getIsActive());
        
        if (insuranceTypeDTO.getPolicies() != null) {
            insuranceType.setPolicies(
                insuranceTypeDTO.getPolicies().stream()
                    .map(this::convertPolicyDtoToEntity)
                    .collect(Collectors.toList())
            );
        }

        return insuranceType;
	}

	@Override
	public InsuranceTypeDTO convertInsuranceTypeToDTO(InsuranceType insuranceType) {
		InsuranceTypeDTO insuranceTypeDTO = new InsuranceTypeDTO();
        insuranceTypeDTO.setTypeId(insuranceType.getTypeId());
        insuranceTypeDTO.setInsuranceCategory(insuranceType.getInsuranceCategory());
        insuranceTypeDTO.setIsActive(insuranceType.getIsActive());

        if (insuranceType.getPolicies() != null) {
            insuranceTypeDTO.setPolicies(
                insuranceType.getPolicies().stream()
                    .map(this::convertPolicyToDTO)
                    .collect(Collectors.toList())
            );
        }

        return insuranceTypeDTO;
	}


	// Convert PolicyDTO to Policy entity
    public Policy convertPolicyDtoToEntity(PolicyDTO policyDTO) {
        Policy policy = new Policy();
        policy.setPolicyId(policyDTO.getPolicyId());
        policy.setPolicyName(policyDTO.getPolicyName());
        policy.setCommissionNewRegistration(policyDTO.getCommissionNewRegistration());
        policy.setCommissionInstallment(policyDTO.getCommissionInstallment());
        policy.setIsActive(policyDTO.getIsActive());
        policy.setDescription(policyDTO.getDescription());
        policy.setMinPolicyTerm(policyDTO.getMinPolicyTerm());
        policy.setMaxPolicyTerm(policyDTO.getMaxPolicyTerm());
        policy.setMinAge(policyDTO.getMinAge());
        policy.setMaxAge(policyDTO.getMaxAge());
        policy.setEligibleGender(policyDTO.getEligibleGender());
        policy.setMinInvestmentAmount(policyDTO.getMinInvestmentAmount());
        policy.setMaxInvestmentAmount(policyDTO.getMaxInvestmentAmount());
        policy.setProfitRatio(policyDTO.getProfitRatio());
        policy.setCreatedDate(policyDTO.getCreatedDate());

        if (policyDTO.getDocumentUploaded() != null) {
            policy.setDocumentUploaded(convertDocumentUploadedDtoToEntity(policyDTO.getDocumentUploaded()));
        }

        if (policyDTO.getDocumentsNeeded() != null) {
            policy.setDocumentsNeeded(
                policyDTO.getDocumentsNeeded().stream()
                    .map(this::convertDocumentNeededDtoToEntity)
                    .collect(Collectors.toList())
            );
        }

        return policy;
    }

    // Convert Policy entity to PolicyDTO
    public PolicyDTO convertPolicyToDTO(Policy policy) {
        PolicyDTO policyDTO = new PolicyDTO();
        policyDTO.setPolicyId(policy.getPolicyId());
        policyDTO.setPolicyName(policy.getPolicyName());
        policyDTO.setCommissionNewRegistration(policy.getCommissionNewRegistration());
        policyDTO.setCommissionInstallment(policy.getCommissionInstallment());
        policyDTO.setIsActive(policy.getIsActive());
        policyDTO.setDescription(policy.getDescription());
        policyDTO.setMinPolicyTerm(policy.getMinPolicyTerm());
        policyDTO.setMaxPolicyTerm(policy.getMaxPolicyTerm());
        policyDTO.setMinAge(policy.getMinAge());
        policyDTO.setMaxAge(policy.getMaxAge());
        policyDTO.setEligibleGender(policy.getEligibleGender());
        policyDTO.setMinInvestmentAmount(policy.getMinInvestmentAmount());
        policyDTO.setMaxInvestmentAmount(policy.getMaxInvestmentAmount());
        policyDTO.setProfitRatio(policy.getProfitRatio());
        policyDTO.setCreatedDate(policy.getCreatedDate());

        if (policy.getDocumentUploaded() != null) {
            policyDTO.setDocumentUploaded(convertDocumentUploadedToDTO(policy.getDocumentUploaded()));
        }

        if (policy.getDocumentsNeeded() != null) {
            policyDTO.setDocumentsNeeded(
                policy.getDocumentsNeeded().stream()
                    .map(this::convertDocumentNeededToDTO)
                    .collect(Collectors.toList())
            );
        }
        
        policyDTO.setInsuranceTypeId(policy.getInsuranceType().getTypeId());

        return policyDTO;
    }
    
    
 // Convert DocumentNeededDTO to DocumentNeeded entity
    public DocumentNeeded convertDocumentNeededDtoToEntity(DocumentNeededDTO documentNeededDTO) {
        DocumentNeeded documentNeeded = new DocumentNeeded();
        documentNeeded.setDocumentId(documentNeededDTO.getDocumentId());
        documentNeeded.setDocumentName(documentNeededDTO.getDocumentName());
        return documentNeeded;
    }

    // Convert DocumentNeeded entity to DocumentNeededDTO
    public DocumentNeededDTO convertDocumentNeededToDTO(DocumentNeeded documentNeeded) {
        DocumentNeededDTO documentNeededDTO = new DocumentNeededDTO();
        documentNeededDTO.setDocumentId(documentNeeded.getDocumentId());
        documentNeededDTO.setDocumentName(documentNeeded.getDocumentName());
        return documentNeededDTO;
    }
    
    public DocumentUploaded convertDocumentUploadedDtoToEntity(DocumentUploadedDTO documentUploadedDTO) {
        DocumentUploaded documentUploaded = new DocumentUploaded();
        documentUploaded.setDocumentId(documentUploadedDTO.getDocumentId());
        documentUploaded.setBlobId(documentUploadedDTO.getBlobId());
        documentUploaded.setName(documentUploadedDTO.getName());
        documentUploaded.setIsApproved(documentUploadedDTO.getIsApproved());

        return documentUploaded;
    }

    // Convert DocumentUploaded entity to DocumentUploadedDTO
    public DocumentUploadedDTO convertDocumentUploadedToDTO(DocumentUploaded documentUploaded) {
        DocumentUploadedDTO documentUploadedDTO = new DocumentUploadedDTO();
        documentUploadedDTO.setDocumentId(documentUploaded.getDocumentId());
        documentUploadedDTO.setBlobId(documentUploaded.getBlobId());
        documentUploadedDTO.setName(documentUploaded.getName());
        documentUploadedDTO.setIsApproved(documentUploaded.getIsApproved());

        if (documentUploaded.getCustomer() != null) {
            documentUploadedDTO.setCustomerId(documentUploaded.getCustomer().getCustomerId());
        }

        if (documentUploaded.getAgent() != null) {
            documentUploadedDTO.setAgentId(documentUploaded.getAgent().getAgentId());
        }

        if (documentUploaded.getPolicy() != null) {
            documentUploadedDTO.setPolicyId(documentUploaded.getPolicy().getPolicyId());
        }

        return documentUploadedDTO;
    }

	@Override
	public List<StateDTO> convertStateListEntityToDTO(List<State> allStates) {
		return allStates.stream()
                .map(this::convertStateToStateDTO)
                .collect(Collectors.toList());
	}

	@Override
	public List<CityDTO> convertCityListEntityToDTO(List<City> allCities) {
		return allCities.stream()
                .map(this::convertCityToDTO)
                .collect(Collectors.toList());
	}

	@Override
	public List<InsuranceTypeDTO> convertInsuranceTypeListEntityToDTO(List<InsuranceType> allInsuranceTypes) {
		return allInsuranceTypes.stream()
                .map(this::convertInsuranceTypeToDTO) 
                .collect(Collectors.toList());
	}

	@Override
	public List<PolicyDTO> convertPolicyListEntityToDTO(List<Policy> allPolicies) {
		return allPolicies.stream()
                .map(this::convertPolicyToDTO)
                .collect(Collectors.toList());
	}

	@Override
	public Settings convertSettingsDtoToSettings(SettingsDTO settingDTO) {
		Settings setting = new Settings();
		GlobalSettings settingKey = GlobalSettings.valueOf(settingDTO.getSettingKey().toUpperCase());
		setting.setSettingKey(settingKey);
	    setting.setSettingValue(settingDTO.getSettingValue());
	    return setting;
	}

	@Override
	public SettingsDTO convertSettingsToSettingsDTO(Settings settings) {
		SettingsDTO updatedSettingDTO = new SettingsDTO();
		updatedSettingDTO.setSettingId(settings.getSettingId());
	    updatedSettingDTO.setSettingKey(settings.getSettingKey().name());
	    updatedSettingDTO.setSettingValue(settings.getSettingValue());
	    return updatedSettingDTO;
	}

	@Override
	public List<EmployeeDTO> convertEmployeeListEntityToDTO(List<Employee> allEmployees) {
		return allEmployees.stream()
                .map(this::converEmployeeToEmployeeResponseDTO)
                .collect(Collectors.toList());
	}

	@Override
	public QueryDTO convertQueryToQueryDTO(Query query) {
		QueryDTO queryDTO = new QueryDTO();
	    queryDTO.setQueryId(query.getQueryId());
	    queryDTO.setQuestion(query.getQuestion());
	    queryDTO.setResponse(query.getResponse());
	    queryDTO.setIsResolved(query.getIsResolved());
	    queryDTO.setCustomerId(query.getCustomer().getCustomerId());
	    return queryDTO;
	}

	@Override
	public List<QueryDTO> convertQueryListEntityToDTO(List<Query> allQueries) {
		return allQueries.stream()
                .map(this::convertQueryToQueryDTO)
                .collect(Collectors.toList());
	}

	@Override
	public List<TransactionsDTO> convertTransactionListEntityToDTO(List<Transactions> allTransactions) {
		return allTransactions.stream()
		        .map(this::convertTransactionEntityToDTO)
		        .collect(Collectors.toList());
	}
	
	public TransactionsDTO convertTransactionEntityToDTO(Transactions transaction) {
	    TransactionsDTO transactionsDTO = new TransactionsDTO();
	    transactionsDTO.setTransactionId(transaction.getTransactionId());
	    transactionsDTO.setAmount(transaction.getAmount());
	    transactionsDTO.setTransactionDate(transaction.getTransactionDate());
	    transactionsDTO.setStatus(transaction.getStatus());
	    transactionsDTO.setPolicyAccountId(transaction.getPolicyAccount().getPolicyAccountId());
	    return transactionsDTO;
	}

	@Override
	public CustomerDTO convertCustomerToCustomerResponseDTO(Customer customer) {
		CustomerDTO customerDTO = new CustomerDTO();
		customerDTO.setCustomerId(customer.getCustomerId());
	    customerDTO.setFirstName(customer.getFirstName());
	    customerDTO.setLastName(customer.getLastName());
	    customerDTO.setDateOfBirth(customer.getDateOfBirth());
	    customerDTO.setGender(customer.getGender());
	    customerDTO.setIsActive(customer.getIsActive());
	    customerDTO.setNomineeName(customer.getNomineeName());
	    customerDTO.setNomineeRelation(customer.getNomineeRelation());
	    customerDTO.setIsApproved(customer.getIsApproved());
	    customerDTO.setAddress(convertEntityToAddressDTO(customer.getAddress()));
	    customerDTO.setCredentials(convertEntityToCredentialsDTO(customer.getCredentials()));
	    
	    return customerDTO;
	}

	public AddressDTO convertEntityToAddressDTO(Address address) {
		AddressDTO addressDTO = new AddressDTO();
	    addressDTO.setAddressId(address.getAddressId());
	    addressDTO.setFirstStreet(address.getFirstStreet());
	    addressDTO.setLastStreet(address.getLastStreet());
	    addressDTO.setPincode(address.getPincode());
	    addressDTO.setState(address.getState().getStateName());
	    addressDTO.setCity(address.getCity().getCityName());
	    return addressDTO;
	}

	@Override
	public Address convertAddressDTOToEntity(AddressDTO addressDTO) {
		Address address = new Address();
	    
	    address.setAddressId(addressDTO.getAddressId());
	    address.setFirstStreet(addressDTO.getFirstStreet());
	    address.setLastStreet(addressDTO.getLastStreet());
	    address.setPincode(addressDTO.getPincode());
	    
	    return address;
	}

	@Override
	public Query convertQueryDTOToEntity(QueryDTO queryDTO) {
		Query query = new Query();
		query.setQueryId(queryDTO.getQueryId());
	    query.setQuestion(queryDTO.getQuestion());
	    query.setResponse(queryDTO.getResponse());
	    query.setIsResolved(queryDTO.getIsResolved());
	    
	    return query;
	}

	@Override
	public Feedback convertFeedbackDTOToEntity(FeedbackDTO feedbackDTO) {
		Feedback feedback = new Feedback();
	    feedback.setFeedbackId(feedbackDTO.getFeedbackId());
	    feedback.setTitle(feedbackDTO.getTitle());
	    feedback.setRating(feedbackDTO.getRating());
	    feedback.setDescription(feedbackDTO.getDescription());
	    return feedback;
	}

	@Override
	public FeedbackDTO convertFeedbackToFeedbackDTO(Feedback feedback) {
		FeedbackDTO feedbackDTO = new FeedbackDTO();
	    feedbackDTO.setFeedbackId(feedback.getFeedbackId());
	    feedbackDTO.setTitle(feedback.getTitle());
	    feedbackDTO.setRating(feedback.getRating());
	    feedbackDTO.setDescription(feedback.getDescription());
	    feedbackDTO.setCustomerId(feedback.getCustomer().getCustomerId());

	    return feedbackDTO;
	}

	@Override
	public List<FeedbackDTO> convertFeedbackListEntityToDTO(List<Feedback> allFeedbacks) {
		return allFeedbacks.stream()
                .map(this::convertFeedbackToFeedbackDTO)
                .collect(Collectors.toList());
	}

	@Override
	public List<PolicyAccountDTO> convertPolicyAccountListEntityToDTO(List<PolicyAccount> allPolicyAccounts) {
		return allPolicyAccounts.stream()
                .map(this::convertPolicyAccountToPolicyAccountDTO)
                .collect(Collectors.toList());
	}
	
	@Override
	public PolicyAccountDTO convertPolicyAccountToPolicyAccountDTO(PolicyAccount policyAccount) {
		PolicyAccountDTO policyAccountDTO = new PolicyAccountDTO();
	    
	    policyAccountDTO.setPolicyAccountId(policyAccount.getPolicyAccountId());
	    policyAccountDTO.setCreatedDate(policyAccount.getCreatedDate());
	    policyAccountDTO.setMaturedDate(policyAccount.getMaturedDate());
	    policyAccountDTO.setIsActive(policyAccount.getIsActive());
	    policyAccountDTO.setPolicyTerm(policyAccount.getPolicyTerm());
	    policyAccountDTO.setPaymentTimeInMonths(policyAccount.getPaymentTimeInMonths());
	    policyAccountDTO.setTimelyBalance(policyAccount.getTimelyBalance());
	    policyAccountDTO.setInvestmentAmount(policyAccount.getInvestmentAmount());
	    policyAccountDTO.setTotalAmountPaid(policyAccount.getTotalAmountPaid());
	    policyAccountDTO.setClaimAmount(policyAccount.getClaimAmount());
	    
	    if (policyAccount.getPolicy() != null) {
	        policyAccountDTO.setPolicyId(policyAccount.getPolicy().getPolicyId());
	    }
	    
	    if (policyAccount.getCustomer() != null) {
	        policyAccountDTO.setCustomerId(policyAccount.getCustomer().getCustomerId());
	    }
	    
	    if (policyAccount.getAgent() != null) {
	        policyAccountDTO.setAgentId(policyAccount.getAgent().getAgentId());
	    }
	    
	    return policyAccountDTO;
	}

	@Override
	public PolicyAccount convertPolicyAccountDtoToPolicyAccount(PolicyAccountDTO policyAccountDTO) {
		PolicyAccount policyAccount = new PolicyAccount();
		
		policyAccount.setPolicyAccountId(policyAccountDTO.getPolicyAccountId());
		policyAccount.setCreatedDate(policyAccountDTO.getCreatedDate());
	    policyAccount.setMaturedDate(policyAccountDTO.getMaturedDate());
	    policyAccount.setIsActive(policyAccountDTO.getIsActive());
	    policyAccount.setPolicyTerm(policyAccountDTO.getPolicyTerm());
	    policyAccount.setPaymentTimeInMonths(policyAccountDTO.getPaymentTimeInMonths());
	    policyAccount.setTimelyBalance(policyAccountDTO.getTimelyBalance());
	    policyAccount.setInvestmentAmount(policyAccountDTO.getInvestmentAmount());
	    policyAccount.setTotalAmountPaid(policyAccountDTO.getTotalAmountPaid());
	    policyAccount.setClaimAmount(policyAccountDTO.getClaimAmount());
	    
	    return policyAccount;
	}

}
