package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeServiceImp implements EmployeeService {

    private final DocumentUploadedRepository documentUploadedRepository;
    private final AccessConService accessConService;
    private final EmployeeRepository employeeRepository;
    private final DtoService dtoService;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private final QueryRepository queryRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final InsuranceTypeRepository insuranceTypeRepository;
    private final TransactionsRepository transactionsRepository;
    private final FeedbackRepository feedbackRepository;
    private final PolicyAccountRepository policyAccountRepository;
    private final WithdrawalRequestsRepository withdrawalRequestsRepository;
    private final AuthRepository authRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmployeeServiceImp(DocumentUploadedRepository documentUploadedRepository, AccessConService accessConService,
                              EmployeeRepository employeeRepository,
                              DtoService dtoService, RoleRepository roleRepository, EmailService emailService, CustomerRepository customerRepository,
                              AgentRepository agentRepository, QueryRepository queryRepository,
                              StateRepository stateRepository, CityRepository cityRepository,
                              InsuranceTypeRepository insuranceTypeRepository,
                              TransactionsRepository transactionsRepository,
                              FeedbackRepository feedbackRepository,
                              PolicyAccountRepository policyAccountRepository,
                              WithdrawalRequestsRepository withdrawalRequestsRepository, AuthRepository authRepository) {
        this.documentUploadedRepository = documentUploadedRepository;
        this.accessConService = accessConService;
        this.employeeRepository = employeeRepository;
        this.dtoService = dtoService;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
        this.queryRepository = queryRepository;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.insuranceTypeRepository = insuranceTypeRepository;
        this.transactionsRepository = transactionsRepository;
        this.feedbackRepository = feedbackRepository;
        this.policyAccountRepository = policyAccountRepository;
        this.withdrawalRequestsRepository = withdrawalRequestsRepository;
        this.authRepository = authRepository;
    }


    @Override
    public EmployeeDTO createEmployee(EmployeeCreationDTO employeeDTO) {
        accessConService.checkAdminAccess();
        employeeDTO.setEmployeeId(0L);
        Employee employee = new Employee();

        employee.setEmployeeId(employeeDTO.getEmployeeId());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setDateOfBirth(employeeDTO.getDateOfBirth());
        employee.setQualification(employeeDTO.getQualification());
        employee.setIsActive(true);

        Credentials credentials = new Credentials();
        credentials.setUsername(employeeDTO.getUsername());
        credentials.setEmail(employeeDTO.getEmail());
        credentials.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
        credentials.setMobileNumber(employeeDTO.getMobileNumber());

        Role role = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
        credentials.setRole(role);

        employee.setCredentials(credentials);
        credentials.setEmployee(employee);
        credentials = authRepository.save(credentials);

        return dtoService.converEmployeeToEmployeeResponseDTO(credentials.getEmployee());
    }
    

	@Override
	public EmployeeCreationDTO getEmployeeById(Long id) {
		accessConService.checkEmployeeAdminAccess(id);
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new UserException("Employee not found"));
        
        return dtoService.convertEmployeeToEmployeeCreationDTO(existingEmployee);
	}


    @Override
    public EmployeeCreationDTO updateEmployee(Long empId, EmployeeCreationDTO employeeDTO) {
        accessConService.checkEmployeeAdminAccess(empId);
        Employee existingEmployee = employeeRepository.findById(empId)
                .orElseThrow(() -> new UserException("Employee not found"));

        existingEmployee.setFirstName(employeeDTO.getFirstName());
        existingEmployee.setLastName(employeeDTO.getLastName());
        existingEmployee.setDateOfBirth(employeeDTO.getDateOfBirth());
        existingEmployee.setQualification(employeeDTO.getQualification());
        existingEmployee.setIsActive(employeeDTO.getIsActive());
        existingEmployee.getCredentials().setUsername(employeeDTO.getUsername());
        existingEmployee.getCredentials().setEmail(employeeDTO.getEmail());
        existingEmployee.getCredentials().setMobileNumber(employeeDTO.getMobileNumber());

        Employee updatedEmployee = employeeRepository.save(existingEmployee);


        return dtoService.convertEmployeeToEmployeeCreationDTO(updatedEmployee);
    }


    @Override
    public void deleteEmployee(Long id) {
        accessConService.checkAdminAccess();
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new UserException("Employee not found"));

        if (!existingEmployee.getIsActive()) {
            throw new UserException("This Employee is already deleted");
        }

        existingEmployee.setIsActive(false);

        employeeRepository.save(existingEmployee);
    }


    @Override
    public PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction) {
        accessConService.checkAdminAccess();
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Employee> pages = employeeRepository.findAll(pageable);
        List<Employee> allEmployees = pages.getContent();
        List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);

        return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction) {
        accessConService.checkAdminAccess();
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Employee> pages = employeeRepository.findByIsActiveTrue(pageable);
        List<Employee> allEmployees = pages.getContent();
        List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);

        return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction) {
        accessConService.checkAdminAccess();
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Employee> pages = employeeRepository.findByIsActiveFalse(pageable);
        List<Employee> allEmployees = pages.getContent();
        List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);

        return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public EmployeeDTO getEmployeeProfile(Long empId) {
        accessConService.checkEmployeeServiceAccess(empId);
        Employee employee = findEmpById(empId);
        return dtoService.convertEmployeeToDTO(employee);
    }

    private Employee findEmpById(Long empId) {
        return employeeRepository.findById(empId).orElseThrow(() -> new UserException("employee not found"));
    }

    @Override
    public EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO) {
        accessConService.checkEmployeeAdminAccess(employeeDTO.getEmployeeId());
        Employee employee = findEmpById(employeeDTO.getEmployeeId());
        updateEmployee(employee, employeeDTO);
        employee=employeeRepository.save(employee);
        return dtoService.convertEmployeeToDTO(employee);
    }

    private void updateEmployee(Employee employee, EmployeeDTO employeeDTO) {
        updateCredentials(employee.getCredentials(), employeeDTO.getCredentials());
        employee.setQualification(employeeDTO.getQualification());
        employee.setDateOfBirth(employeeDTO.getDateOfBirth());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());

    }

    private void updateCredentials(Credentials credentials, CredentialsResponseDTO credentialsResponseDTO) {
        credentials.setUsername(credentialsResponseDTO.getUsername());
        credentials.setEmail(credentialsResponseDTO.getEmail());
        credentials.setMobileNumber(credentialsResponseDTO.getMobileNumber());
        authRepository.save(credentials);
    }


    @Override
    public PagedResponse<QueryDTO> getAllQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findAll(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
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
    public PagedResponse<StateDTO> getAllStates(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<State> pages = stateRepository.findAll(pageable);
        List<State> allStates = pages.getContent();
//		System.out.println(allStates);
        List<StateDTO> allStatesDTO = dtoService.convertStateListEntityToDTO(allStates);

        return new PagedResponse<StateDTO>(allStatesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<CityDTO> getAllCities(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<City> pages = cityRepository.findAll(pageable);
        List<City> allCities = pages.getContent();
        List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);

        return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<InsuranceTypeDTO> getAllInsuranceTypes(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<InsuranceType> pages = insuranceTypeRepository.findAll(pageable);
        List<InsuranceType> allInsuranceTypes = pages.getContent();
        List<InsuranceTypeDTO> allInsuranceTypesDTO = dtoService.convertInsuranceTypeListEntityToDTO(allInsuranceTypes);

        return new PagedResponse<InsuranceTypeDTO>(allInsuranceTypesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByIsResolvedTrue(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<QueryDTO> getAllUnresolvedQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByIsResolvedFalse(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<QueryDTO> getAllQueriesByCustomer(int page, int size, String sortBy, String direction, Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByCustomer(customer, pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
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

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Transactions> pages = transactionsRepository.findByTransactionDateBetween(startDate, endDate, pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

        return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<FeedbackDTO> getAllFeedbacks(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Feedback> pages = feedbackRepository.findAll(pageable);
        List<Feedback> allFeedbacks = pages.getContent();
        List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);

        return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<FeedbackDTO> getAllFeedbacksByCustomer(int page, int size, String sortBy, String direction,
                                                                Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Feedback> pages = feedbackRepository.findByCustomer(customer, pageable);
        List<Feedback> allFeedbacks = pages.getContent();
        List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);

        return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(),
                pages.getSize(), pages.getTotalElements(), pages.getTotalPages(),
                pages.isLast());
    }
    @Override
    public Boolean approveCustomerProfile(Long customerId, Boolean isApproved) {
        Customer customer = findCustomerById(customerId);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(customer.getCredentials().getEmail());
        if (!isApproved) {
            emailDTO.setTitle("Profile Verification failed");
            emailDTO.setBody("Oops!! your profile details are not correct.\n Please update them");
        } else {
            int isSuccess = customerRepository.findByIdAndSetIsApprovedTrue(customerId);
            emailDTO.setTitle("Profile Verified");
            emailDTO.setBody("Congrats!! your profile details has been verfied by us.\n Now, you can purchase policies\n" +
                    "\nPlease login and start buying policies and start working");
        }
        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }

    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new UserException("customer not found"));
    }

    @Override
    public Boolean approveDocument(Long documentId, Boolean isApproved) {
        DocumentUploaded documentUploaded = findDocumentById(documentId);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(documentUploaded.getCustomer().getCredentials().getEmail());
        if (!isApproved) {
            emailDTO.setTitle("Document Verification failed");
            emailDTO.setBody("Oops!! your profile details are not correct.\n Please update them");
        } else {
            int isSuccess = documentUploadedRepository.findByIdAndSetIsApprovedTrue(documentId);
            emailDTO.setTitle("Document Verified");
            emailDTO.setBody("Congrats!! your Document " + documentUploaded.getDocumentType() + " has been verified by us.\n Now, you can purchase policies\n" +
                    "\nPlease login and start buying policies and start booming!");
        }
        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }

    private DocumentUploaded findDocumentById(Long documentId) {
        return documentUploadedRepository.findById(documentId).orElseThrow(() -> new UserException("document not found"));
    }


	@Override
	public PagedResponse<PolicyAccountDTO> getAllPolicyAccount(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<PolicyAccount> pages = policyAccountRepository.findAll(pageable);
        List<PolicyAccount> allFeedbacks = pages.getContent();
        List<PolicyAccountDTO> allFeedbacksDTO = dtoService.convertPolicyAccountListEntityToDTO(allFeedbacks);

        return new PagedResponse<PolicyAccountDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<PolicyAccountDTO> getAllPolicyAccountByCustomer(int page, int size, String sortBy,
			String direction, Long id) {
		Customer customer = customerRepository.findById(id).orElseThrow(() -> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<PolicyAccount> pages = policyAccountRepository.findByCustomer(customer, pageable);
        List<PolicyAccount> allFeedbacks = pages.getContent();
        List<PolicyAccountDTO> allFeedbacksDTO = dtoService.convertPolicyAccountListEntityToDTO(allFeedbacks);

        return new PagedResponse<PolicyAccountDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<PolicyAccountDTO> getAllPolicyAccountByAgent(int page, int size, String sortBy,
			String direction, Long id) {
		Agent agent = agentRepository.findById(id).orElseThrow(() -> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<PolicyAccount> pages = policyAccountRepository.findByAgent(agent, pageable);
        List<PolicyAccount> allFeedbacks = pages.getContent();
        List<PolicyAccountDTO> allFeedbacksDTO = dtoService.convertPolicyAccountListEntityToDTO(allFeedbacks);

        return new PagedResponse<PolicyAccountDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<AgentDTO> getAllActiveAgent(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Agent> pages = agentRepository.findByIsActiveTrue(pageable);
        List<Agent> allFeedbacks = pages.getContent();
        List<AgentDTO> allFeedbacksDTO = dtoService.convertAgentListEntityToDTO(allFeedbacks);

        return new PagedResponse<AgentDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<AgentDTO> getAllInactiveAgent(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Agent> pages = agentRepository.findByIsActiveFalse(pageable);
        List<Agent> allFeedbacks = pages.getContent();
        List<AgentDTO> allFeedbacksDTO = dtoService.convertAgentListEntityToDTO(allFeedbacks);

        return new PagedResponse<AgentDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


}
