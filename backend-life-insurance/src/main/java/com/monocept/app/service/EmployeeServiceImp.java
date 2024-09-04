package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeServiceImp implements EmployeeService{

    private final AccessConService accessConService;
    private final EmployeeRepository employeeRepository;
    private final DtoService dtoService;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;
    private  final QueryRepository queryRepository;
    private  final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final InsuranceTypeRepository insuranceTypeRepository;
    private final TransactionsRepository transactionsRepository;
    private final FeedbackRepository feedbackRepository;
    private final PolicyAccountRepository policyAccountRepository;
    private final WithdrawalRequestsRepository withdrawalRequestsRepository;

    public EmployeeServiceImp(AccessConService accessConService, EmployeeRepository employeeRepository,
                              DtoService dtoService, CustomerRepository customerRepository,
                              AgentRepository agentRepository, QueryRepository queryRepository,
                              StateRepository stateRepository, CityRepository cityRepository,
                              InsuranceTypeRepository insuranceTypeRepository,
                              TransactionsRepository transactionsRepository,
                              FeedbackRepository feedbackRepository,
                              PolicyAccountRepository policyAccountRepository,
                              WithdrawalRequestsRepository withdrawalRequestsRepository) {
        this.accessConService = accessConService;
        this.employeeRepository = employeeRepository;
        this.dtoService = dtoService;
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
    }

    @Override
    public EmployeeDTO getEmployeeProfile(Long empId) {
        accessConService.checkEmployeeServiceAccess(empId);
        Employee employee=findEmpById(empId);
        return dtoService.convertEmployeeToDTO(employee);
    }

    private Employee findEmpById(Long empId) {
        return employeeRepository.findById(empId).orElseThrow(()->new NoSuchElementException("employee not found"));
    }

    @Override
    public EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO) {
        accessConService.checkEmployeeServiceAccess(employeeDTO.getEmployeeId());
        Employee employee=findEmpById(employeeDTO.getEmployeeId());
        return dtoService.convertEmployeeToDTO(employee);
    }


    @Override
    public Boolean deleteCustomer(Long customerId) {
        accessConService.checkEmployeeServiceAccess(customerId);
        Customer customer=findCustomerById(customerId);
        if(!customer.getIsActive()) throw new NoSuchElementException("customer is already deleted");
        customer.setIsActive(false);
        customerRepository.save(customer);
        return true;
    }

    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(()->new NoSuchElementException("customer not found"));
    }

    @Override
    public PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Agent> agentPage = agentRepository.findAll(pageable);
        List<Agent> agents = agentPage.getContent();
        List<AgentDTO> agentDTOS=dtoService.convertAgentsToDto(agents);
        return new PagedResponse<>(agentDTOS, agentPage.getNumber(),
                agentPage.getSize(), agentPage.getTotalElements(), agentPage.getTotalPages(),
                agentPage.isLast());
    }

    @Override
    public Boolean deleteAgent(Long agentId) {
        Agent agent=findAgentById(agentId);
        if(!agent.getIsActive()){
            throw new NoSuchElementException("agent is already deleted");
        }
        agent.setIsActive(false);
        agentRepository.save(agent);
        return true;
    }

    private Agent findAgentById(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }

    @Override
    public Boolean activateAgent(Long agentId) {
        Agent agent=findAgentById(agentId);
        if(agent.getIsActive()) throw new NoSuchElementException("agent is already activated");
        agent.setIsActive(true);
        agentRepository.save(agent);
        return true;
    }

    @Override
    public Boolean activateCustomer(Long customerId) {
        Customer customer=findCustomerById(customerId);
        if(customer.getIsActive()) throw new NoSuchElementException("customer is already activated");
        customer.setIsActive(true);
        customerRepository.save(customer);
        return true;
    }

    @Override
    public PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> customerPage = customerRepository.findAllByIsActiveTrue(pageable);
        List<Customer> customers = customerPage.getContent();
        List<CustomerDTO> customerDTOS=dtoService.convertCustomersToDto(customers);
        return new PagedResponse<>(customerDTOS, customerPage.getNumber(),
                customerPage.getSize(), customerPage.getTotalElements(), customerPage.getTotalPages(),
                customerPage.isLast());
    }

    @Override
    public PagedResponse<CustomerDTO> getAllInActiveCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> customerPage = customerRepository.findAllByIsActiveFalse(pageable);
        List<Customer> customers = customerPage.getContent();
        List<CustomerDTO> customerDTOS=dtoService.convertCustomersToDto(customers);
        return new PagedResponse<>(customerDTOS, customerPage.getNumber(),
                customerPage.getSize(), customerPage.getTotalElements(), customerPage.getTotalPages(),
                customerPage.isLast());
    }

    @Override
    public QueryDTO updateQuery(Long id, QueryDTO queryDTO) {
        Query existingQuery = queryRepository.findById(id)
                .orElseThrow(() -> new UserException("Query not found"));

        existingQuery.setQuestion(queryDTO.getQuestion());
        existingQuery.setResponse(queryDTO.getResponse());
        existingQuery.setIsResolved(queryDTO.getIsResolved());

        Query updatedQuery = queryRepository.save(existingQuery);

//		send email to customer about its query

        return dtoService.convertQueryToQueryDTO(updatedQuery);
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

        return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(),
                pages.getSize(), pages.getTotalElements(), pages.getTotalPages(),
                pages.isLast());
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsRequest(int pageNo, int size, String sort,
                                                                          String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<WithdrawalRequests> withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedFalse(pageable);
        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=dtoService.convertWithdrawalsToDto(withdrawalRequests);
        return new PagedResponse<>(withdrawalRequestsDTOS, withdrawalRequestsPage.getNumber(),
                withdrawalRequestsPage.getSize(), withdrawalRequestsPage.getTotalElements(), withdrawalRequestsPage.getTotalPages(),
                withdrawalRequestsPage.isLast());
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsApproved(int pageNo, int size, String sort,
                                                                           String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<WithdrawalRequests> withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedTrue(pageable);
        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=dtoService.convertWithdrawalsToDto(withdrawalRequests);
        return new PagedResponse<>(withdrawalRequestsDTOS, withdrawalRequestsPage.getNumber(),
                withdrawalRequestsPage.getSize(), withdrawalRequestsPage.getTotalElements(), withdrawalRequestsPage.getTotalPages(),
                withdrawalRequestsPage.isLast());
    }
}
