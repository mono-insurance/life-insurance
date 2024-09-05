package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.DocumentType;
import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;
import com.monocept.app.utils.PageResult;
import com.monocept.app.repository.RoleRepository;
import com.monocept.app.utils.GlobalSettings;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service
public class DtoServiceImp implements DtoService{

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    public DtoServiceImp(StateRepository stateRepository, CityRepository cityRepository) {
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;

    }

    @Override
    public AdminDTO convertToAdminResponseDTO(Admin admin) {
        return new AdminDTO(
                admin.getAdminId(),
                admin.getFirstName(),
                admin.getLastName(),
                convertToCredentialsDTO(admin.getCredentials())
        );
    }



    @Override
    public Customer convertCustomerDtoToCustomer(RegistrationDTO customerDTO) {
        Customer customer=new Customer();
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setIsApproved(false);
        customer.setGender(GenderType.valueOf(customerDTO.getGender()));
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setNomineeName(customerDTO.getNomineeName());
        customer.setNomineeRelation(NomineeRelation.valueOf(customerDTO.getNomineeRelation()));
        customer.setIsActive(false);
        return customer;
    }


    @Override
    public AgentDTO convertAgentToAgentDto(Agent agent) {
        AgentDTO agentDTO=new AgentDTO();
        agentDTO.setAgentId(agent.getAgentId());
        agentDTO.setFirstName(agent.getFirstName());
        agentDTO.setLastName(agent.getLastName());
        agentDTO.setQualification(agent.getQualification());
        agentDTO.setDateOfBirth(agent.getDateOfBirth());
        agentDTO.setIsApproved(agent.getIsApproved());
        agentDTO.setIsActive(agent.getIsActive());
        AddressDTO addressDTO=convertAddressToDto(agent.getAddress());
        agentDTO.setAddress(addressDTO);
        CredentialsResponseDTO credentialsResponseDTO=convertToCredentialsDTO(agent.getCredentials());
        agentDTO.setCredentials(credentialsResponseDTO);
        return agentDTO;
    }

    @Override
    public AddressDTO convertAddressToDto(Address address) {
    AddressDTO addressDTO=new AddressDTO();
    addressDTO.setCity(address.getCity().getCityName());
    addressDTO.setState(address.getState().getStateName());
    addressDTO.setPincode(address.getPincode());
    addressDTO.setFirstStreet(address.getFirstStreet());
    addressDTO.setLastStreet(address.getLastStreet());
    return addressDTO;
    }

    @Override
    public Address convertDtoToAddress(AddressDTO addressDTO) {
        Address address=new Address();
        address.setPincode(addressDTO.getPincode());
        address.setFirstStreet(addressDTO.getFirstStreet());
        address.setLastStreet(addressDTO.getLastStreet());
        updateCityAndState(address,addressDTO);
        return  address;
    }
    @Override
    public void updateCityAndState(Address agentAddress, AddressDTO address) {
        if(!agentAddress.getState().getStateName().equals(address.getState())){
            Optional<State> statecheck= stateRepository.findByStateName(address.getState());
            if(statecheck.isEmpty()) throw new NoSuchElementException("state not found");
            State state=statecheck.get();
            agentAddress.setState(state);
        }
        City cityInState = agentAddress.getState().getCities().stream()
                .filter(city -> city.getCityName().equals(address.getCity()))
                .findFirst()
                .orElse(null);
        if(cityInState==null) {
            throw new NoSuchElementException("city not found");
        }
        agentAddress.setCity(cityInState);
    }

    @Override
    public Credentials convertCredentialResponseDtoToCredentials(Credentials credentials, CredentialsResponseDTO credentialsResponseDTO) {
        credentials.setEmail(credentialsResponseDTO.getEmail());
        credentials.setMobileNumber(credentialsResponseDTO.getMobileNumber());
        credentials.setUsername(credentialsResponseDTO.getUsername());
        return credentials;
    }

    @Override
    public PageResult convertToPage(List<PolicyAccount> policyAccountList, int pageNo, String sort, String sortBy,
                                    String sortDirection, int size) {
        Comparator<PolicyAccount> comparator;

        switch (sortBy.toLowerCase()) {
            case "policyAccountId":
                comparator = Comparator.comparing(PolicyAccount::getPolicyAccountId); // Assuming account number is a String
                break;
            case "paymentTimeInMonths":
                comparator = Comparator.comparing(PolicyAccount::getPaymentTimeInMonths); // Assuming balance is a BigDecimal
                break;
            case "createddate":
                comparator = Comparator.comparing(PolicyAccount::getCreatedDate); // Assuming created date is a LocalDateTime
                break;
            default:
                comparator = Comparator.comparing(PolicyAccount::getIsActive); // Default sort by ID or any default field
                break;
        }

        // If descending order is required, reverse the comparator
        if (sortDirection.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        policyAccountList.sort(comparator);

        // Step 3: Implement pagination using subList method
        int start = pageNo * size;
        int end = Math.min((start + size), policyAccountList.size());
        List<PolicyAccount> result=policyAccountList.subList(start, end);
        return new PageResult(result,end);
    }

    @Override
    public List<PolicyAccountDTO> convertPolicyAccountsToDto(List<PolicyAccount> policyAccounts) {
        List<PolicyAccountDTO> policyAccountDTOS=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            policyAccountDTOS.add(convertPolicyAccountToDto(policyAccount));
        }
        return policyAccountDTOS;
    }

    private PolicyAccountDTO convertPolicyAccountToDto(PolicyAccount policyAccount) {
        PolicyAccountDTO policyAccountDTO=new PolicyAccountDTO();
        policyAccountDTO.setPolicyAccountId(policyAccount.getPolicyAccountId());
        policyAccountDTO.setIsActive(policyAccount.getIsActive());
        policyAccountDTO.setPolicyTerm(policyAccountDTO.getPolicyTerm());
        policyAccountDTO.setCreatedDate(policyAccount.getCreatedDate());
        policyAccountDTO.setClaimAmount(policyAccountDTO.getClaimAmount());
        policyAccountDTO.setCustomerId(policyAccountDTO.getCustomerId());
        policyAccountDTO.setMaturedDate(policyAccount.getMaturedDate());
        policyAccountDTO.setAgentId(policyAccountDTO.getAgentId());
        policyAccountDTO.setPaymentTimeInMonths(policyAccountDTO.getPaymentTimeInMonths());
        policyAccountDTO.setTotalAmountPaid(policyAccount.getTotalAmountPaid());
        policyAccountDTO.setPolicyId(policyAccountDTO.getPolicyId());
        policyAccountDTO.setTimelyBalance(policyAccountDTO.getTimelyBalance());
        return policyAccountDTO;

    }

    @Override
    public PageResult convertWithdrawalsToPage(List<WithdrawalRequests> withdrawalRequests, int pageNo,
                                               String sort, String sortBy, String sortDirection, int size) {
        Comparator<WithdrawalRequests> comparator;

        switch (sortBy.toLowerCase()) {
            case "withdrawalRequestsId":
                comparator = Comparator.comparing(WithdrawalRequests::getWithdrawalRequestsId); // Assuming account number is a String
                break;
            case "amount":
                comparator = Comparator.comparing(WithdrawalRequests::getAmount); // Assuming balance is a BigDecimal
                break;
            default:
                comparator = Comparator.comparing(WithdrawalRequests::getAmount); // Default sort by ID or any default field
                break;
        }

        // If descending order is required, reverse the comparator
        if (sortDirection.equalsIgnoreCase("desc")) {
            comparator = comparator.reversed();
        }

        withdrawalRequests.sort(comparator);

        // Step 3: Implement pagination using subList method
        int start = pageNo * size;
        int end = Math.min((start + size), withdrawalRequests.size());
        List<WithdrawalRequests> result=withdrawalRequests.subList(start, end);
        return new PageResult(result,end);
    }

    @Override
    public List<WithdrawalRequestsDTO>  convertWithdrawalsToDto(List<WithdrawalRequests>  withdrawalRequests) {
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=new ArrayList<>();
        for(WithdrawalRequests withdrawalRequest:withdrawalRequests){
            withdrawalRequestsDTOS.add(convertWithdrawalToDto(withdrawalRequest));
        }
        return null;
    }

    @Override
    public PageResult convertCustomersToPage(List<Customer> customerList, int pageNo, String sort, String sortBy, String sortDirection, int size) {
        return null;
    }

    @Override
    public List<CustomerDTO> convertCustomersToDto(List<Customer> customers) {
        List<CustomerDTO>customerDTOS=new ArrayList<>();
        for(Customer customer:customers){
            customerDTOS.add(convertCustomerToDto(customer));
        }
        return customerDTOS;
    }

    @Override
    public EmployeeDTO convertEmployeeToDTO(Employee employee) {
        return new EmployeeDTO(employee.getEmployeeId(),employee.getFirstName(),
                employee.getLastName(),employee.getDateOfBirth(),employee.getQualification(),
                employee.getIsActive(),convertToCredentialsDTO(employee.getCredentials()));
    }

    @Override
    public List<AgentDTO> convertAgentsToDto(List<Agent> agents) {
        List<AgentDTO> agentDTOS=new ArrayList<>();
        for(Agent agent:agents){
            agentDTOS.add(convertAgentToAgentDto(agent));
        }
        return agentDTOS;
    }

    private CustomerDTO convertCustomerToDto(Customer customer) {
        CustomerDTO customerDTO=new CustomerDTO();
        customerDTO.setCustomerId(customer.getCustomerId());
        customerDTO.setAddress(convertAddressToDto(customer.getAddress()));
        customerDTO.setCredentials(convertToCredentialsDTO(customer.getCredentials()));
        customerDTO.setGender(customer.getGender());
        customerDTO.setFirstName(customer.getFirstName());
        customerDTO.setLastName(customer.getLastName());
        customerDTO.setIsActive(customer.getIsActive());
        customerDTO.setIsApproved(customer.getIsApproved());
        customerDTO.setDateOfBirth(customer.getDateOfBirth());
        customerDTO.setNomineeRelation(customer.getNomineeRelation());
        customerDTO.setNomineeName(customer.getNomineeName());
        return customerDTO;
    }

    private WithdrawalRequestsDTO convertWithdrawalToDto(WithdrawalRequests withdrawalRequest) {
        WithdrawalRequestsDTO withdrawalRequestsDTO=new WithdrawalRequestsDTO();
        withdrawalRequestsDTO.setAmount(withdrawalRequest.getAmount());
        withdrawalRequestsDTO.setIsWithdraw(withdrawalRequest.getIsWithdraw());
        withdrawalRequestsDTO.setRequestType(withdrawalRequest.getRequestType());
        withdrawalRequestsDTO.setIsApproved(withdrawalRequest.getIsApproved());
        withdrawalRequestsDTO.setWithdrawalRequestsId(withdrawalRequest.getWithdrawalRequestsId());
        return withdrawalRequestsDTO;
    }


    private CredentialsResponseDTO convertToCredentialsDTO(Credentials credentials) {
        return new CredentialsResponseDTO(
                credentials.getId(),
                credentials.getUsername(),
                credentials.getEmail(),
                credentials.getMobileNumber(),
                credentials.getRole().getName()
        );
    }
	
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

    @Override
	public Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
		Employee employee = new Employee();
		employee.setEmployeeId(employeeDTO.getEmployeeId());
	    employee.setFirstName(employeeDTO.getFirstName());
	    employee.setLastName(employeeDTO.getLastName());
	    employee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    employee.setQualification(employeeDTO.getQualification());
	    employee.setIsActive(employeeDTO.getIsActive());
	    
	    return employee;
	}
	

    @Override
	public Agent convertAgentDtoToAgent(AgentDTO agentDTO) {
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

//        if (policyDTO.getDocumentUploaded() != null) {
//            policy.setDocumentUploaded(convertDocumentUploadedDtoToEntity(policyDTO.getDocumentUploaded()));
//        }

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

//        if (policy.getDocumentUploaded() != null) {
//            policyDTO.setDocumentUploaded(convertDocumentUploadedToDTO(policy.getDocumentUploaded()));
//        }

        if (policy.getDocumentsNeeded() != null) {
            policyDTO.setDocumentsNeeded(
                policy.getDocumentsNeeded().stream()
                    .map(this::convertDocumentNeededToDTO)
                    .collect(Collectors.toList())
            );
        }
        
        if (policy.getInsuranceType() != null) {
            policyDTO.setInsuranceTypeId(policy.getInsuranceType().getTypeId());
        }

        return policyDTO;
    }
    
    
    public DocumentNeeded convertDocumentNeededDtoToEntity(DocumentNeededDTO documentNeededDTO) {
        DocumentNeeded documentNeeded = new DocumentNeeded();
        documentNeeded.setDocumentId(documentNeededDTO.getDocumentId());
        
        // Ensure that documentNeededDTO.getDocumentType() is a String
        if (documentNeededDTO.getDocumentType() != null) {
            try {
                documentNeeded.setDocumentType(DocumentType.valueOf(documentNeededDTO.getDocumentType()));
            } catch (IllegalArgumentException e) {
                // Handle invalid enum value
                throw new IllegalArgumentException("Invalid document type: " + documentNeededDTO.getDocumentType(), e);
            }
        }
        
        return documentNeeded;
    }



    // Convert DocumentNeeded entity to DocumentNeededDTO
    public DocumentNeededDTO convertDocumentNeededToDTO(DocumentNeeded documentNeeded) {
        DocumentNeededDTO documentNeededDTO = new DocumentNeededDTO();
        documentNeededDTO.setDocumentId(documentNeeded.getDocumentId());
        
        // Handle enum conversion
        if (documentNeeded.getDocumentType() != null) {
            documentNeededDTO.setDocumentType(documentNeeded.getDocumentType().name());
        }
        
        return documentNeededDTO;
    }

    public DocumentUploaded convertDocumentUploadedDtoToEntity(DocumentUploadedDTO documentUploadedDTO) {
        DocumentUploaded documentUploaded = new DocumentUploaded();
        documentUploaded.setDocumentId(documentUploadedDTO.getDocumentId());
        
        // Handle enum conversion
        if (documentUploadedDTO.getDocumentType() != null) {
            documentUploaded.setDocumentType(DocumentType.valueOf(documentUploadedDTO.getDocumentType()));
        }
       
        documentUploaded.setIsApproved(documentUploadedDTO.getIsApproved());

        return documentUploaded;
    }

    // Convert DocumentUploaded entity to DocumentUploadedDTO
    public DocumentUploadedDTO convertDocumentUploadedToDTO(DocumentUploaded documentUploaded) {
        DocumentUploadedDTO documentUploadedDTO = new DocumentUploadedDTO();
        documentUploadedDTO.setDocumentId(documentUploaded.getDocumentId());
        
        // Handle enum conversion
        if (documentUploaded.getDocumentType() != null) {
            documentUploadedDTO.setDocumentType(documentUploaded.getDocumentType().name());
        }
        
        documentUploadedDTO.setIsApproved(documentUploaded.getIsApproved());

        if (documentUploaded.getCustomer() != null) {
            documentUploadedDTO.setCustomerId(documentUploaded.getCustomer().getCustomerId());
        }

        if (documentUploaded.getAgent() != null) {
            documentUploadedDTO.setAgentId(documentUploaded.getAgent().getAgentId());
        }

        // Uncomment if applicable
        // if (documentUploaded.getPolicy() != null) {
        //     documentUploadedDTO.setPolicyId(documentUploaded.getPolicy().getPolicyId());
        // }

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
	    transactionsDTO.setCardType(transaction.getCardType());
	    transactionsDTO.setCardAccountNumber(transaction.getCardAccountNumber());
	    transactionsDTO.setCvv(transaction.getCvv());
	    transactionsDTO.setExpiryDate(transaction.getExpiryDate());
	    return transactionsDTO;
	}
	
	public Transactions convertTransactionDtoToEntity(TransactionsDTO transactionsDTO) {
	    Transactions transaction = new Transactions();
	    transaction.setTransactionId(transactionsDTO.getTransactionId());
	    transaction.setAmount(transactionsDTO.getAmount());
	    transaction.setTransactionDate(transactionsDTO.getTransactionDate());
	    transaction.setStatus(transactionsDTO.getStatus());
	    
	    // Set additional fields
	    transaction.setCardType(transactionsDTO.getCardType());
	    transaction.setCardAccountNumber(transactionsDTO.getCardAccountNumber());
	    transaction.setCvv(transactionsDTO.getCvv());
	    transaction.setExpiryDate(transactionsDTO.getExpiryDate());
	    
	    return transaction;
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
	    if(address.getCustomer() != null) addressDTO.setCustomerId(address.getCustomer().getCustomerId());
	    if(address.getAgent() != null) addressDTO.setAgentId(address.getAgent().getAgentId());
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

	@Override
	public List<SettingsDTO> convertSettingsListEntityToDTO(List<Settings> allSettings) {
		return allSettings.stream()
                .map(this::convertSettingsToSettingsDTO)
                .collect(Collectors.toList());
	}

	@Override
	public WithdrawalRequestsDTO convertWithdrawalRequestToDTO(WithdrawalRequests withdrawalRequest) {
		WithdrawalRequestsDTO dto = new WithdrawalRequestsDTO();
        dto.setWithdrawalRequestsId(withdrawalRequest.getWithdrawalRequestsId());
        dto.setRequestType(withdrawalRequest.getRequestType());
        dto.setAmount(withdrawalRequest.getAmount());
        dto.setIsWithdraw(withdrawalRequest.getIsWithdraw());
        dto.setIsApproved(withdrawalRequest.getIsApproved());
        dto.setPolicyAccountId(withdrawalRequest.getPolicyAccount().getPolicyAccountId());
        dto.setAgentId(withdrawalRequest.getAgent() != null ? withdrawalRequest.getAgent().getAgentId() : null);
        dto.setCustomerId(withdrawalRequest.getCustomer() != null ? withdrawalRequest.getCustomer().getCustomerId() : null);

        return dto;
	}

	@Override
	public List<WithdrawalRequestsDTO> convertWithdrawalRequestsListEntityToDTO(List<WithdrawalRequests> allWithdrawalRequests) {
		return allWithdrawalRequests.stream()
                .map(this::convertWithdrawalRequestToDTO)
                .collect(Collectors.toList());
	}
}
