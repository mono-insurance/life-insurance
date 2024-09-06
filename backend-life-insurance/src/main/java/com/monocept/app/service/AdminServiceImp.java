package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
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
	private final AgentRepository agentRepository;
	private final DocumentNeededRepository documentNeededRepository;
	private final EmailService emailService;
	
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
						   AuthRepository authRepository, PasswordEncoder passwordEncoder, AgentRepository agentRepository,
						   DocumentNeededRepository documentNeededRepository, EmailService emailService) {
		this.employeeRepository = employeeRepository;
		this.accessConService = accessConService;
        this.adminRepository = adminRepository;
        this.dtoService = dtoService;
        this.roleRepository = roleRepository;
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
		this.agentRepository = agentRepository;
		this.documentNeededRepository = documentNeededRepository;
		this.emailService = emailService;
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
		EmailDTO emailDTO=new EmailDTO();
		emailDTO.setEmailId(credentialsDTO.getEmail());
		emailDTO.setTitle("Employee created");
		emailDTO.setBody("Congrats!! your account has been created by admin.\n Now, you are employee of our company\n" +
				"your username is "+credentials.getUsername()+"\nPlease login and change your password and start working");
		emailService.sendAccountCreationEmail(emailDTO);
		
		return dtoService.converEmployeeToEmployeeResponseDTO(newCredentials.getEmployee());

	}

//
//	@Override
//	public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
//		Employee existingEmployee = employeeRepository.findById(id)
//	            .orElseThrow(() -> new UserException("Employee not found"));
//
//		existingEmployee.setFirstName(employeeDTO.getFirstName());
//	    existingEmployee.setLastName(employeeDTO.getLastName());
//	    existingEmployee.setDateOfBirth(employeeDTO.getDateOfBirth());
//	    existingEmployee.setQualification(employeeDTO.getQualification());
//	    existingEmployee.setIsActive(employeeDTO.getIsActive());
//	    existingEmployee.getCredentials().setUsername(employeeDTO.getCredentials().getUsername());
//	    existingEmployee.getCredentials().setEmail(employeeDTO.getCredentials().getEmail());
//	    existingEmployee.getCredentials().setMobileNumber(employeeDTO.getCredentials().getMobileNumber());
//
//		Employee updatedEmployee = employeeRepository.save(existingEmployee);
//
//
//		return dtoService.converEmployeeToEmployeeResponseDTO(updatedEmployee);
//	}


	@Override
	public void deleteEmployee(Long id) {
		Employee existingEmployee = employeeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Employee not found"));
		
		if(!existingEmployee.getIsActive()) {
			throw new UserException("This Employee is already deleted");
		}
		
		existingEmployee.setIsActive(false);
		existingEmployee=employeeRepository.save(existingEmployee);

		EmailDTO emailDTO=new EmailDTO();
		emailDTO.setEmailId(existingEmployee.getCredentials().getEmail());
		emailDTO.setTitle("Employee Deleted");
		emailDTO.setBody("Congrats!! your account has been deleted by admin.\n" +
				" Now, you are no longer an employee of our company\n" +
				"your username is "+existingEmployee.getCredentials().getUsername()+
				"\nPlease Contact admin if it is a mistake");
		emailService.sendAccountCreationEmail(emailDTO);
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
	public void deleteQuery(Long id) {
		Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));
		
		queryRepository.delete(existingQuery);
		
	}

	@Override
	public Boolean approveAgent(Long agentId) {
		Agent agent=findAgentById(agentId);
		agent.setIsApproved(true);
		agentRepository.save(agent);
		EmailDTO emailDTO=new EmailDTO();
		emailDTO.setEmailId(agent.getCredentials().getEmail());
		emailDTO.setTitle("Agent Approved");
		emailDTO.setBody("Congrats!! your account has been activated by admin.\n" +
				" Now, you are an agent of our company\n" +
				"your username is "+agent.getCredentials().getUsername()+
				"\nPlease Start working to get new customers to us.");
		emailService.sendAccountCreationEmail(emailDTO);
//		send email to agent
		return true;
	}

	@Override
	public List<InsuranceTypeDTO> getInsuranceTypes() {
		List<InsuranceType> insuranceTypes=insuranceTypeRepository.findAll();
		return dtoService.convertInsuranceTypeListEntityToDTO(insuranceTypes);

	}

	private Agent findAgentById(Long agentId) {
		return agentRepository.findById(agentId).orElseThrow(()->new NoSuchElementException("agent not found"));
	}


}
