package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.DocumentType;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImp implements AdminService {

    private AccessConService accessConService;
    private AdminRepository adminRepository;
    private DtoService dtoService;
    private PasswordEncoder passwordEncoder;
    private RoleRepository roleRepository;
    private AuthRepository authRepository;
    private final AgentRepository agentRepository;
    private final DocumentNeededRepository documentNeededRepository;
    private final EmailService emailService;
    private final EmployeeRepository employeeRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final InsuranceTypeRepository insuranceTypeRepository;
    private final QueryRepository queryRepository;
    private final SettingsRepository settingsRepository;
    private final PolicyRepository policyRepository;


    @Autowired
    private AuthRepository credentialsRepository;
    
    @Autowired
    private CustomerRepository customerRepository;


    @Autowired
    public AdminServiceImp(AccessConService accessConService, AdminRepository adminRepository,
                           DtoService dtoService, EmployeeRepository employeeRepository, RoleRepository roleRepository,
                           AuthRepository authRepository, PasswordEncoder passwordEncoder, AuthRepository authRepository1,
                           AgentRepository agentRepository, DocumentNeededRepository documentNeededRepository,
                           EmailService emailService, EmployeeRepository employeeRepository1, StateRepository stateRepository,
                           CityRepository cityRepository, InsuranceTypeRepository insuranceTypeRepository, QueryRepository queryRepository,
                           SettingsRepository settingsRepository, PolicyRepository policyRepository, AuthRepository credentialsRepository) {
        this.accessConService = accessConService;
        this.adminRepository = adminRepository;
        this.dtoService = dtoService;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authRepository = authRepository1;
        this.agentRepository = agentRepository;
        this.documentNeededRepository = documentNeededRepository;
        this.emailService = emailService;
        this.employeeRepository = employeeRepository1;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.insuranceTypeRepository = insuranceTypeRepository;
        this.queryRepository = queryRepository;
        this.settingsRepository = settingsRepository;
        this.policyRepository = policyRepository;
        this.credentialsRepository = credentialsRepository;
    }

    @Override
    public AdminCreationDTO getAdminProfile() {
        CustomUserDetails userDetails = accessConService.checkUserAccess();

        Admin admin = adminRepository.findById(userDetails.getId())
                .orElseThrow(() -> new UserException("Admin not found"));

        return dtoService.converAdminToAdminCreationDTO(admin);
    }


    @Override
    public AdminCreationDTO updateAdminProfile(AdminCreationDTO adminCreationDTO) {
        CustomUserDetails userDetails = accessConService.checkUserAccess();

        Admin admin = adminRepository.findById(userDetails.getId())
                .orElseThrow(() -> new UserException("Admin not found"));

        admin.setFirstName(adminCreationDTO.getFirstName());
        admin.setLastName(adminCreationDTO.getLastName());

        admin.getCredentials().setUsername(adminCreationDTO.getUsername());
        admin.getCredentials().setEmail(adminCreationDTO.getEmail());
        admin.getCredentials().setPassword(passwordEncoder.encode(adminCreationDTO.getPassword()));
        admin.getCredentials().setMobileNumber(adminCreationDTO.getMobileNumber());

        Admin updatedAdmin = adminRepository.save(admin);

        return dtoService.converAdminToAdminCreationDTO(updatedAdmin);
    }


    @Override
    public AdminDTO makeAnotherAdmin(AdminCreationDTO adminCreationDTO) {
        adminCreationDTO.setAdminId(0L);

        Admin admin = new Admin();
        admin.setFirstName(adminCreationDTO.getFirstName());
        admin.setLastName(adminCreationDTO.getLastName());
        Credentials credentials = new Credentials();

        credentials.setUsername(adminCreationDTO.getUsername());
        credentials.setEmail(adminCreationDTO.getEmail());
        credentials.setPassword(passwordEncoder.encode(adminCreationDTO.getPassword()));
        credentials.setMobileNumber(adminCreationDTO.getMobileNumber());

        Role role = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
        credentials.setRole(role);

        admin.setCredentials(credentials);
        credentials.setAdmin(admin);
        credentials = credentialsRepository.save(credentials);

        AdminDTO adminDTO = dtoService.converAdminToAdminResponseDTO(credentials.getAdmin());

        return adminDTO;

    }

    @Override
    public EmployeeDTO createEmployee(CredentialsDTO credentialsDTO) {
        credentialsDTO.setId(0L);
        Credentials credentials = dtoService.convertCredentialsDtoToCredentials(credentialsDTO);
        credentials.getEmployee().setIsActive(true);
        Credentials newCredentials = authRepository.save(credentials);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(credentialsDTO.getEmail());
        emailDTO.setTitle("Employee created");
        emailDTO.setBody("Congrats!! your account has been created by admin.\n Now, you are employee of our company\n" +
                "your username is " + credentials.getUsername() + "\nPlease login and change your password and start working");
        emailService.sendAccountCreationEmail(emailDTO);

        return dtoService.converEmployeeToEmployeeResponseDTO(newCredentials.getEmployee());

    }

    @Override
    public void deleteEmployee(Long id) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new UserException("Employee not found"));

        if (!existingEmployee.getIsActive()) {
            throw new UserException("This Employee is already deleted");
        }

        existingEmployee.setIsActive(false);
        existingEmployee = employeeRepository.save(existingEmployee);

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(existingEmployee.getCredentials().getEmail());
        emailDTO.setTitle("Employee Deleted");
        emailDTO.setBody("Oops!! your account has been deleted by admin.\n" +
                " Now, you are no longer an employee of our company\n" +
                "your username is " + existingEmployee.getCredentials().getUsername() +
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

        if (!existingState.getIsActive()) {
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

        if (policyDTO.getDocumentsNeeded() != null) {

            existingPolicy.setDocumentsNeeded(policyDTO.getDocumentsNeeded().stream()
            		.map(documentName -> {
            			DocumentType documentType = DocumentType.valueOf(documentName.toUpperCase());
            			DocumentNeeded documentNeeded = documentNeededRepository.findByDocumentType(documentType)
                                .orElseThrow(() -> new UserException("DocumentNeeded not found with name " + documentName));
                        return documentNeeded;
                    })
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
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

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
    public PagedResponse<AgentDTO> getAllRegisteredAgents(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Agent> pages = agentRepository.findAllByIsApprovedFalse(pageable);
        List<Agent> allEmployees = pages.getContent();
        List<AgentDTO> allEmployeesDTO = dtoService.convertAgentsToDto(allEmployees);

        return new PagedResponse<AgentDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Employee> pages = employeeRepository.findByIsActiveTrue(pageable);
        List<Employee> allEmployees = pages.getContent();
        List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);

        return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

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
    public List<InsuranceTypeDTO> getInsuranceTypes() {
        List<InsuranceType> insuranceTypes = insuranceTypeRepository.findAll();
        return dtoService.convertInsuranceTypeListEntityToDTO(insuranceTypes);

    }

    private Agent findAgentById(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(() -> new UserException("agent not found"));
    }

	@Override
	public SystemCounts wholeSystemStats() {
		try {
			long totalActiveCustomers = customerRepository.countByIsActiveTrue();
	        long totalInactiveCustomers = customerRepository.countByIsActiveFalse();
	        long totalCustomers = customerRepository.count();
	        long totalActiveAgents = agentRepository.countByIsActiveTrue();
	        long totalInactiveAgents = agentRepository.countByIsActiveFalse();
	        long totalAgents = agentRepository.count();
	        long totalActiveEmployees = employeeRepository.countByIsActiveTrue();
	        long totalInactiveEmployees = employeeRepository.countByIsActiveFalse();
	        long totalEmployees = employeeRepository.count();
	        long totalAdmins = adminRepository.count();
	        
	        return new SystemCounts(
	                totalActiveCustomers,
	                totalInactiveCustomers,
	                totalActiveAgents,
	                totalInactiveAgents,
	                totalActiveEmployees,
	                totalInactiveEmployees,
	                totalAdmins,
	                totalCustomers,
	                totalAgents,
	                totalEmployees
	            );
		}
		catch(Exception e) {
			throw new UserException("Error getting system stats");
		}
	}

	@Override
	public PagedResponse<UserDTO> getNewUsers(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Credentials> pages = credentialsRepository.findAll(pageable);
        List<Credentials> allCredentials = pages.getContent();
        List<UserDTO> allCredentialsDTO = dtoService.convertCredentialsListEntityToUserDTO(allCredentials);

        return new PagedResponse<UserDTO>(allCredentialsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


}
