package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Employee;
import com.monocept.app.entity.Feedback;
import com.monocept.app.entity.InsuranceType;
import com.monocept.app.entity.Policy;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Query;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.State;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.EmployeeRepository;
import com.monocept.app.repository.FeedbackRepository;
import com.monocept.app.repository.InsuranceTypeRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.PolicyRepository;
import com.monocept.app.repository.QueryRepository;
import com.monocept.app.repository.RoleRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.monocept.app.entity.Admin;
import com.monocept.app.entity.City;
import com.monocept.app.repository.AdminRepository;
import com.monocept.app.repository.AuthRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImp implements AdminService{
	
	private AccessConService accessConService;
    private AdminRepository adminRepository;
    private DtoService dtoService;
	private EmployeeRepository employeeRepository;
	private PasswordEncoder passwordEncoder;
	private RoleRepository roleRepository;
	private AuthRepository authRepository;
	
	@Autowired
    private StateRepository stateRepository;

    @Autowired
    private CityRepository cityRepository;
    
    @Autowired
    private InsuranceTypeRepository insuranceTypeRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private SettingsRepository settingsRepository;
    
    @Autowired
    private QueryRepository queryRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private TransactionsRepository transactionsRepository;
    
    @Autowired
    private PolicyAccountRepository policyAccountRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    
	@Autowired
    public AdminServiceImp(AccessConService accessConService, AdminRepository adminRepository,
						   DtoService dtoService, EmployeeRepository employeeRepository, RoleRepository roleRepository,
						   AuthRepository authRepository, PasswordEncoder passwordEncoder) {
		this.employeeRepository = employeeRepository;
		this.accessConService = accessConService;
        this.adminRepository = adminRepository;
        this.dtoService = dtoService;
        this.roleRepository = roleRepository;
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

	@Override
	public AdminDTO getAdminProfile() {
		CustomUserDetails userDetails = accessConService.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
	
		return dtoService.converAdminToAdminResponseDTO(admin);
	}
	
	
	@Override
	public AdminDTO updateAdminProfile(AdminDTO adminDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
		
		admin.setFirstName(adminDTO.getFirstName());
	    admin.setLastName(adminDTO.getLastName());
	    admin.getCredentials().setUsername(adminDTO.getCredentials().getUsername());
	    admin.getCredentials().setEmail(adminDTO.getCredentials().getEmail());
	    admin.getCredentials().setMobileNumber(adminDTO.getCredentials().getMobileNumber());
	    
	    Admin updatedAdmin = adminRepository.save(admin);
	    
	    return dtoService.converAdminToAdminResponseDTO(updatedAdmin);
	}

	

	@Override
	public AdminDTO makeAnotherAdmin(CredentialsDTO credentialsDTO) {
		credentialsDTO.setId(0L);
		Credentials credentials = dtoService.convertCredentialsDtoToCredentials(credentialsDTO);
	    Credentials newCredentials = authRepository.save(credentials);
	    
	    AdminDTO adminDTO = dtoService.converAdminToAdminResponseDTO(newCredentials.getAdmin());
	    
	    return adminDTO;
		
	}

	@Override
	public EmployeeDTO createEmployee(CredentialsDTO credentialsDTO) {
		credentialsDTO.setId(0L);
		Credentials credentials = dtoService.convertCredentialsDtoToCredentials(credentialsDTO);
		credentials.getEmployee().setIsActive(true);
		Credentials newCredentials = authRepository.save(credentials);
		
		EmployeeDTO employeeDTO = dtoService.converEmployeeToEmployeeResponseDTO(newCredentials.getEmployee());
		
		return employeeDTO;
	}

	@Override
	public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
		Employee existingEmployee = employeeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Employee not found"));
		
		existingEmployee.setFirstName(employeeDTO.getFirstName());
	    existingEmployee.setLastName(employeeDTO.getLastName());
	    existingEmployee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    existingEmployee.setQualification(employeeDTO.getQualification());
	    existingEmployee.setIsActive(employeeDTO.getIsActive());
	    existingEmployee.getCredentials().setUsername(employeeDTO.getCredentials().getUsername());
	    existingEmployee.getCredentials().setEmail(employeeDTO.getCredentials().getEmail());
	    existingEmployee.getCredentials().setMobileNumber(employeeDTO.getCredentials().getMobileNumber());
		
		Employee updatedEmployee = employeeRepository.save(existingEmployee);
		
		
		return dtoService.converEmployeeToEmployeeResponseDTO(updatedEmployee);
	}


	@Override
	public void deleteEmployee(Long id) {
		Employee existingEmployee = employeeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Employee not found"));
		
		if(!existingEmployee.getIsActive()) {
			throw new UserException("This Employee is already deleted");
		}
		
		existingEmployee.setIsActive(false);
		
		employeeRepository.save(existingEmployee);
	}

	@Override
	public StateDTO addState(StateDTO stateDTO) {
		stateDTO.setStateId(0L);
		State state = dtoService.convertStateDtoToEntity(stateDTO);
		state.setIsActive(true);
		State savedState = stateRepository.save(state);
	    return dtoService.convertStateToStateDTO(savedState);
	}

	@Override
	public StateDTO updateState(Long id, StateDTO stateDTO) {
		State existingState = stateRepository.findById(id)
	            .orElseThrow(() -> new UserException("State not found"));

        existingState.setStateName(stateDTO.getStateName());
        existingState.setIsActive(stateDTO.getIsActive());

        State updatedState = stateRepository.save(existingState);
        return dtoService.convertStateToStateDTO(updatedState);
	}

	@Override
	public void deleteState(Long id) {
		State existingState = stateRepository.findById(id)
	            .orElseThrow(() -> new UserException("State not found"));
		
		if(!existingState.getIsActive()) {
			throw new UserException("This State is already deleted");
		}

		existingState.setIsActive(false);
		stateRepository.save(existingState);
	}

	@Override
	public CityDTO addCity(CityDTO cityDTO) {
		State state = stateRepository.findById(cityDTO.getStateId()).orElseThrow(() -> new UserException("State not found"));
		
		if (!state.getIsActive()) {
	        throw new UserException("Cannot add city to an inactive state");
	    }
		
		cityDTO.setCityId(0L);
		City city = dtoService.convertCityDtoToEntity(cityDTO);
		city.setIsActive(true);
		city.setState(state);
		City savedCity = cityRepository.save(city);
		state.getCities().add(savedCity);
	    return dtoService.convertCityToDTO(savedCity);
	}

	@Override
	public CityDTO updateCity(Long id, CityDTO cityDTO) {
		City existingCity = cityRepository.findById(id)
	            .orElseThrow(() -> new UserException("City not found"));


	    State state = stateRepository.findById(cityDTO.getStateId())
	            .orElseThrow(() -> new UserException("State not found"));
	    
	    if (!state.getIsActive()) {
	        throw new UserException("Cannot update city in an inactive state");
	    }
	    
	    if (!existingCity.getIsActive()) {
	        throw new UserException("Cannot update city as it is inactive");
	    }
	    
	    
	    existingCity.setCityName(cityDTO.getCityName());
	    existingCity.setIsActive(cityDTO.getIsActive());
	    if (!existingCity.getState().equals(state)) {
	    	
	        existingCity.getState().getCities().remove(existingCity);
	        
	        existingCity.setState(state);
	        state.getCities().add(existingCity);
	    }
	    
	    City updatedCity = cityRepository.save(existingCity);

	    return dtoService.convertCityToDTO(updatedCity);
	}

	@Override
	public void deleteCity(Long id) {
		City existingCity = cityRepository.findById(id)
	            .orElseThrow(() -> new UserException("City not found"));

	    if (!existingCity.getIsActive()) {
	        throw new UserException("This City is already deleted");
	    }

	    existingCity.setIsActive(false);

	    cityRepository.save(existingCity);
		
	}

	@Override
	public InsuranceTypeDTO addInsuranceType(InsuranceTypeDTO insuranceTypeDTO) {

	    insuranceTypeDTO.setTypeId(0L);
	    InsuranceType insuranceType = dtoService.convertInsuranceTypeDtoToEntity(insuranceTypeDTO);
	    insuranceType.setIsActive(true);
	    
	    InsuranceType savedInsuranceType = insuranceTypeRepository.save(insuranceType);
	    return dtoService.convertInsuranceTypeToDTO(savedInsuranceType);
	}

	@Override
	public InsuranceTypeDTO updateInsuranceType(Long id, InsuranceTypeDTO insuranceTypeDTO) {
	    InsuranceType existingInsuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Insurance type not found"));

	    if (!existingInsuranceType.getIsActive()) {
	        throw new UserException("Cannot update an inactive insurance type");
	    }

	    existingInsuranceType.setInsuranceCategory(insuranceTypeDTO.getInsuranceCategory());
	    existingInsuranceType.setIsActive(insuranceTypeDTO.getIsActive());

	    InsuranceType updatedInsuranceType = insuranceTypeRepository.save(existingInsuranceType);
	    return dtoService.convertInsuranceTypeToDTO(updatedInsuranceType);
	}

	@Override
	public void deleteInsuranceType(Long id) {
	    InsuranceType existingInsuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Insurance type not found"));

	    if (!existingInsuranceType.getIsActive()) {
	        throw new UserException("This insurance type is already deleted");
	    }

	    existingInsuranceType.setIsActive(false);
	    insuranceTypeRepository.save(existingInsuranceType);
	}

	@Override
	public PolicyDTO addPolicy(PolicyDTO policyDTO) {
		InsuranceType insuranceType = insuranceTypeRepository.findById(policyDTO.getInsuranceTypeId())
	            .orElseThrow(() -> new UserException("InsuranceType not found with id " + policyDTO.getInsuranceTypeId()));
		
		policyDTO.setPolicyId(0L);
		Policy policy = dtoService.convertPolicyDtoToEntity(policyDTO);
		policy.setIsActive(true);
		policy.setInsuranceType(insuranceType);
		insuranceType.getPolicies().add(policy);
		Policy savedPolicy = policyRepository.save(policy);
		
		insuranceType.getPolicies().add(savedPolicy);
	    return dtoService.convertPolicyToDTO(savedPolicy);
		
	}


	@Override
	public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
		Policy existingPolicy = policyRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy not found with id " + id));
		
		InsuranceType insuranceType = insuranceTypeRepository.findById(policyDTO.getInsuranceTypeId())
	            .orElseThrow(() -> new UserException("InsuranceType not found with id " + policyDTO.getInsuranceTypeId()));
		
		if (!insuranceType.getIsActive()) {
	        throw new UserException("Cannot update policy in an inactive insurance category");
	    }
		
		if (!existingPolicy.getIsActive()) {
	        throw new UserException("Cannot update an inactive policy");
	    }
		
		existingPolicy.setPolicyName(policyDTO.getPolicyName());
	    existingPolicy.setCommissionNewRegistration(policyDTO.getCommissionNewRegistration());
	    existingPolicy.setCommissionInstallment(policyDTO.getCommissionInstallment());
	    existingPolicy.setIsActive(policyDTO.getIsActive());
	    existingPolicy.setDescription(policyDTO.getDescription());
	    existingPolicy.setMinPolicyTerm(policyDTO.getMinPolicyTerm());
	    existingPolicy.setMaxPolicyTerm(policyDTO.getMaxPolicyTerm());
	    existingPolicy.setMinAge(policyDTO.getMinAge());
	    existingPolicy.setMaxAge(policyDTO.getMaxAge());
	    existingPolicy.setEligibleGender(policyDTO.getEligibleGender());
	    existingPolicy.setMinInvestmentAmount(policyDTO.getMinInvestmentAmount());
	    existingPolicy.setMaxInvestmentAmount(policyDTO.getMaxInvestmentAmount());
	    existingPolicy.setProfitRatio(policyDTO.getProfitRatio());
	    existingPolicy.setCreatedDate(policyDTO.getCreatedDate());
	    
	    
//	    if (policyDTO.getDocumentUploaded() != null) {
//	    	existingPolicy.setDocumentUploaded(dtoService.convertDocumentUploadedDtoToEntity(policyDTO.getDocumentUploaded()));
//        }

	    if (policyDTO.getDocumentsNeeded() != null) {
	        
	        existingPolicy.setDocumentsNeeded(policyDTO.getDocumentsNeeded().stream()
		            .map(dtoService::convertDocumentNeededDtoToEntity)
		            .collect(Collectors.toList()
		          ));
	    }
	    
		if (!existingPolicy.getInsuranceType().equals(insuranceType)) {
			    	
			existingPolicy.getInsuranceType().getPolicies().remove(existingPolicy);
	        
			existingPolicy.setInsuranceType(insuranceType);
			insuranceType.getPolicies().add(existingPolicy);
	    }
	    
	    Policy updatedPolicy = policyRepository.save(existingPolicy);

	    return dtoService.convertPolicyToDTO(updatedPolicy);
	}

	@Override
	public void deletePolicy(Long id) {
		Policy existingPolicy = policyRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy not found with id " + id));
		
		
		if (!existingPolicy.getIsActive()) {
	        throw new UserException("Cannot update an inactive policy");
	    }
		
		
		existingPolicy.setIsActive(false);
		
		policyRepository.save(existingPolicy);
		
	}

	@Override
	public PagedResponse<StateDTO> getAllStates(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<State> pages = stateRepository.findAll(pageable);
		List<State> allStates = pages.getContent();
//		System.out.println(allStates);
		List<StateDTO> allStatesDTO = dtoService.convertStateListEntityToDTO(allStates);
		
		return new PagedResponse<StateDTO>(allStatesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<CityDTO> getAllCities(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<City> pages = cityRepository.findAll(pageable);
		List<City> allCities = pages.getContent();
		List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);
		
		return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<InsuranceTypeDTO> getAllInsuranceTypes(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<InsuranceType> pages = insuranceTypeRepository.findAll(pageable);
		List<InsuranceType> allInsuranceTypes = pages.getContent();
		List<InsuranceTypeDTO> allInsuranceTypesDTO = dtoService.convertInsuranceTypeListEntityToDTO(allInsuranceTypes);
		
		return new PagedResponse<InsuranceTypeDTO>(allInsuranceTypesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Policy> pages = policyRepository.findAll(pageable);
		List<Policy> allPolicies = pages.getContent();
		List<PolicyDTO> allPoliciesDTO = dtoService.convertPolicyListEntityToDTO(allPolicies);
		
		return new PagedResponse<PolicyDTO>(allPoliciesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public SettingsDTO addOrUpdateSetting(SettingsDTO settingDTO) {
		Settings settings = dtoService.convertSettingsDtoToSettings(settingDTO);
	    
		Optional<Settings> existingSettingOpt = settingsRepository.findBySettingKey(settings.getSettingKey());
		
		if (existingSettingOpt.isPresent()) {
			
            Settings existingSetting = existingSettingOpt.get();
            existingSetting.setSettingValue(settings.getSettingValue());
            settings = settingsRepository.save(existingSetting);
        } else {
        	settings = settingsRepository.save(settings);
        }
		
		return dtoService.convertSettingsToSettingsDTO(settings);
	}

	@Override
	public SettingsDTO getSetting(String settingKey) {
		
		GlobalSettings settingKeyExists = GlobalSettings.valueOf(settingKey);
	    Optional<Settings> settingOpt = settingsRepository.findBySettingKey(settingKeyExists);

	    Settings setting = settingOpt.orElseThrow(() -> new RuntimeException("Setting not found: " + settingKey));

	    return dtoService.convertSettingsToSettingsDTO(setting);
	}

	@Override
	public PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findAll(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	
	@Override
	public PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findByIsActiveTrue(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	
	@Override
	public PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findByIsActiveFalse(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<QueryDTO> getAllQueries(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Query> pages = queryRepository.findAll(pageable);
		List<Query> allQueries = pages.getContent();
		List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);
		
		return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	@Override
	public PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Query> pages = queryRepository.findByIsResolvedTrue(pageable);
		List<Query> allQueries = pages.getContent();
		List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);
		
		return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<QueryDTO> getAllUnresolvedQueries(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Query> pages = queryRepository.findByIsResolvedFalse(pageable);
		List<Query> allQueries = pages.getContent();
		List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);
		
		return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<QueryDTO> getAllQueriesByCustomer(int page, int size, String sortBy, String direction, Long id) {
		Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Query> pages = queryRepository.findByCustomer(customer, pageable);
		List<Query> allQueries = pages.getContent();
		List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);
		
		return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}



	@Override
	public QueryDTO updateQuery(Long id, QueryDTO queryDTO) {
		Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));

	    existingQuery.setQuestion(queryDTO.getQuestion());
	    existingQuery.setResponse(queryDTO.getResponse());
	    existingQuery.setIsResolved(queryDTO.getIsResolved());
	    
	    Query updatedQuery = queryRepository.save(existingQuery);

	    return dtoService.convertQueryToQueryDTO(updatedQuery);
	}

	@Override
	public void deleteQuery(Long id) {
		Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));
		
		queryRepository.delete(existingQuery);
		
	}

	@Override
	public PagedResponse<TransactionsDTO> getAllTransactions(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);
	    
	    Page<Transactions> pages = transactionsRepository.findAll(pageable);
	    List<Transactions> allTransactions = pages.getContent();
	    List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);
	    
	    return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
			String direction, Long id) {
		PolicyAccount policyAccount = policyAccountRepository.findById(id)
		        .orElseThrow(() -> new UserException("Policy account not found"));
		    
	    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);
	    
	    Page<Transactions> pages = transactionsRepository.findByPolicyAccount(policyAccount, pageable);
	    List<Transactions> allTransactions = pages.getContent();
	    List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);
	    
	    return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<TransactionsDTO> getAllTransactionsByCustomer(int page, int size, String sortBy,
			String direction, Long id) {
		Customer customer = customerRepository.findById(id)
		        .orElseThrow(() -> new UserException("Customer not found"));

	    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);

	    List<PolicyAccount> policyAccounts = policyAccountRepository.findByCustomer(customer);

	    Page<Transactions> pages = transactionsRepository.findByPolicyAccountIn(policyAccounts, pageable);
	    List<Transactions> allTransactions = pages.getContent();
	    List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

	    return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<TransactionsDTO> getAllTransactionsBetweenDate(int page, int size, String sortBy,
			String direction, LocalDate startDate, LocalDate endDate) {
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Transactions> pages = transactionsRepository.findByTransactionDateBetween(startDate, endDate, pageable);
		List<Transactions> allTransactions = pages.getContent();
		List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);
		
		return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<FeedbackDTO> getAllFeedbacks(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Feedback> pages = feedbackRepository.findAll(pageable);
		List<Feedback> allFeedbacks = pages.getContent();
		List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);
		
		return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	public PagedResponse<FeedbackDTO> getAllFeedbacksByCustomer(int page, int size, String sortBy, String direction,
			Long id) {
		Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Feedback> pages = feedbackRepository.findByCustomer(customer, pageable);
		List<Feedback> allFeedbacks = pages.getContent();
		List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);
		
		return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}






}
