package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.PageResult;
import com.monocept.app.utils.PagedResponse;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AgentServiceImp implements AgentService {
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final DtoService dtoService;
    private final AccessConService accessConService;
    private final AgentRepository agentRepository;
    private final CityRepository cityRepository;
    private final StateRepository stateRepository;
    private final AuthRepository authRepository;
    private final AddressRepository addressRepository;
    private final RoleRepository roleRepository;

    private final EmailService emailService;
    private final WithdrawalRequestsRepository withdrawalRequestsRepository;
    private final AuthRepository credentialsRepository;
    private final CustomerRepository customerRepository;


    public AgentServiceImp(DtoService dtoService, AccessConService accessConService, AgentRepository agentRepository,
                           CityRepository cityRepository, StateRepository stateRepository, AuthRepository authRepository,
                           AddressRepository addressRepository, RoleRepository roleRepository, EmailService emailService,
                           WithdrawalRequestsRepository withdrawalRequestsRepository, AuthRepository credentialsRepository, CustomerRepository customerRepository) {
        this.dtoService = dtoService;
        this.accessConService = accessConService;
        this.agentRepository = agentRepository;
        this.cityRepository = cityRepository;
        this.stateRepository = stateRepository;
        this.authRepository = authRepository;
        this.addressRepository = addressRepository;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
        this.withdrawalRequestsRepository = withdrawalRequestsRepository;
        this.credentialsRepository = credentialsRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Long agentRegisterRequest( RegistrationDTO registrationDTO) {
        registrationDTO.setId(0L);
        Agent agent = new Agent();
        agent.setFirstName(registrationDTO.getFirstName());
        agent.setLastName(registrationDTO.getLastName());
        agent.setDateOfBirth(registrationDTO.getDateOfBirth());
        agent.setIsActive(false);
        agent.setIsApproved(false);
        Credentials credentials = new Credentials();
        credentials.setUsername(registrationDTO.getUsername());
        credentials.setEmail(registrationDTO.getEmail());
        String encriptedPassword = passwordEncoder.encode(registrationDTO.getPassword());
        credentials.setPassword(encriptedPassword);
        credentials.setMobileNumber(registrationDTO.getMobileNumber());
        credentials.setAgent(agent);
        Role role = roleRepository.findByName("ROLE_AGENT")
                .orElseThrow(() -> new RuntimeException("Role agent not found"));
        credentials.setRole(role);

        Address address = new Address();
        address.setFirstStreet(registrationDTO.getFirstStreet());
        address.setLastStreet(registrationDTO.getLastStreet());
        address.setPincode(registrationDTO.getPincode());

        State state = stateRepository.findById(registrationDTO.getStateId())
                .orElseThrow(() -> new UserException("State not found"));
        if (!state.getIsActive()) {
            throw new UserException("Selected state is inactive");
        }

        City city = cityRepository.findById(registrationDTO.getCityId())
                .orElseThrow(() -> new UserException("City not found"));
        if (!city.getIsActive()) {
            throw new UserException("Selected city is inactive");
        }

        address.setState(state);
        address.setCity(city);

        address = addressRepository.save(address);
        agent.setAddress(address);
        agent.setCredentials(credentials);
        agent.setWithdrawalAmount(0D);
        agent.setBalance(0D);
        agent.setQualification(registrationDTO.getQualification());
        credentials = credentialsRepository.save(credentials);


        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(credentials.getEmail());
        emailDTO.setTitle("Registration Success");
        emailDTO.setBody("Congrats!! you have registered with our company as an agent.\n" +
                " Now, your details will be verified by our company employees" +
                " and your account will be activated\n We will inform you once details verified" +
                "your username is " + credentials.getUsername());
        emailService.sendAccountCreationEmail(emailDTO);

        return credentials.getAgent().getAgentId();
    }

    @Override
    public AgentDTO updateAgent(AgentDTO agentDTO) {
        accessConService.checkSameUserOrRole(agentDTO.getAgentId());
        Agent agent = findAgent(agentDTO.getAgentId());
        agent = updatethisAgent(agent, agentDTO);
        agent = agentRepository.save(agent);
        EmailDTO emailDTO=new EmailDTO();
        emailDTO.setEmailId(agent.getCredentials().getEmail());
        emailDTO.setTitle("Profile update");
        emailDTO.setBody("You have updated your profile, now your account is under review" +
                "your username is "+agent.getCredentials().getUsername());
        return dtoService.convertAgentToAgentDto(agent);
    }

    private Agent findAgent(Long agentId) {
        return agentRepository.findById(agentId).
                orElseThrow(() -> new UserException("agent not found"));
    }

    private Agent updatethisAgent(Agent agent, AgentDTO agentDTO) {
        if(agent.getAddress()!=null)  agentDTO.getAddress().setAddressId(agent.getAddress().getAddressId());
        Address address = dtoService.convertDtoToAddress(agentDTO.getAddress());
        agent.setAddress(address);
        agent.setFirstName(agentDTO.getFirstName());
        agent.setLastName(agentDTO.getLastName());
        agent.setDateOfBirth(agentDTO.getDateOfBirth());
        agent.setIsApproved(false);
        Credentials credentials = dtoService.convertCredentialResponseDtoToCredentials(agent.getCredentials(), agentDTO.getCredentials());
        authRepository.save(credentials);
        return agent;
    }

    private Address updateAgentAddress(Address agentAddress, AddressDTO address) {
        agentAddress.setFirstStreet(address.getFirstStreet());
        agentAddress.setLastStreet(address.getLastStreet());
//        state and city
        dtoService.updateCityAndState(agentAddress, address);

        agentAddress.setPincode(address.getPincode());
        return addressRepository.save(agentAddress);

    }


    @Override
    public AgentDTO viewProfile(Long agentId) {
        accessConService.checkSameUserOrRole(agentId);
        Agent agent = findAgent(agentId);
        return dtoService.convertAgentToAgentDto(agent);
    }

    @Override
    public PagedResponse<PolicyAccountDTO> getAllCustomerAccounts(int pageNo, int size, String sort,
                                                                 String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts = agent.getPolicyAccounts();
        PageResult pageResult = dtoService.convertToPage(policyAccounts, pageNo, sort, sortBy, sortDirection, size);
        List policyAccountDTOS = dtoService.convertPolicyAccountsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                policyAccountDTOS,
                pageNo,
                size,
                policyAccounts.size(),
                (policyAccounts.size() + size - 1) / size,
                end == policyAccounts.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAgentCommission(int pageNo, int size, String sort,
                                                                   String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<WithdrawalRequests> withdrawalRequests = agent.getWithdrawalRequests();
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getWithdrawalCommission(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<WithdrawalRequests> withdrawalRequests = agent.getWithdrawalRequests()
                .stream()
                .filter(WithdrawalRequests::getIsApproved)
                .collect(Collectors.toList());
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaims(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Long agentId = accessConService.checkUserAccess().getId();
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts=agent.getPolicyAccounts();
        List<WithdrawalRequests> withdrawalRequests=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            withdrawalRequests.addAll(policyAccount.getWithdrawalRequests());
        }
        PageResult pageResult = dtoService.convertWithdrawalsToPage(withdrawalRequests, pageNo, sort, sortBy, sortDirection, size);
        List withDrawalDTO = dtoService.convertWithdrawalsToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                withDrawalDTO,
                pageNo,
                size,
                withdrawalRequests.size(),
                (withdrawalRequests.size() + size - 1) / size,
                end == withdrawalRequests.size()
        );
    }

    @Override
    public PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection, Boolean isActive) {
        Long agentId = accessConService.checkUserAccess().getId();
        String role= accessConService.getUserRole();
        if(role.equals("EMPLOYEE") || role.equals("ADMIN")){
            Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

            Pageable pageable = (Pageable) PageRequest.of(pageNo, size, sorting);
            Page<Customer> page=customerRepository.findAll(pageable);
            List<Customer> customers=page.getContent();
            List<Customer>requiredCustomers = new ArrayList<Customer>();
            if(isActive){
                for(Customer customer:customers){
                    if(customer.getIsActive()) requiredCustomers.add(customer);
                }
            }
            else {
                for(Customer customer:customers){
                    if(!customer.getIsActive()) requiredCustomers.add(customer);
                }
            }

            List<CustomerDTO> customerDTOS=dtoService.convertCustomersToDto(customers);
            return new PagedResponse<>(customerDTOS,page.getNumber(),page.getSize(),
                    page.getTotalElements(),page.getTotalPages(),page.isLast());

        }
        Agent agent = findAgent(agentId);
        List<PolicyAccount> policyAccounts=agent.getPolicyAccounts();
        List<Customer> customerList=new ArrayList<>();
        for(PolicyAccount policyAccount:policyAccounts){
            if(isActive){
                if(policyAccount.getCustomer().getIsActive()) customerList.add(policyAccount.getCustomer());
            }
            else{
                if(!policyAccount.getCustomer().getIsActive()) customerList.add(policyAccount.getCustomer());
            }

        }
        PageResult pageResult = dtoService.convertCustomersToPage(customerList, pageNo, sort, sortBy, sortDirection, size);
        List<CustomerDTO> customerDto = dtoService.convertCustomersToDto(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                customerDto,
                pageNo,
                size,
                customerList.size(),
                (customerList.size() + size - 1) / size,
                end == customerList.size()
        );
    }
    @Override
    public Boolean withdrawalRequest(Double agentCommission) {
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        Long agentId=customUserDetails.getId();
        Agent agent=findAgent(agentId);
        if(agent.getBalance()<agentCommission){
            throw new UserException("your balance is less than requested");
        }
        WithdrawalRequests withdrawalRequests=new WithdrawalRequests();
        withdrawalRequests.setAgent(agent);
        withdrawalRequests.setIsWithdraw(false);
        withdrawalRequests.setRequestType("Commission");
        withdrawalRequests.setIsApproved(false);
        withdrawalRequests.setAmount(agentCommission);
        withdrawalRequests=withdrawalRequestsRepository.save(withdrawalRequests);
        agent.getWithdrawalRequests().add(withdrawalRequests);
        agentRepository.save(agent);
        return true;
    }
    @Override
    public PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkEmployeeAccess();
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
        accessConService.checkEmployeeAccess();
        Agent agent=findAgentById(agentId);
        if(!agent.getIsActive()){
            throw new UserException("agent is already deleted");
        }
        agent.setIsActive(false);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(agent.getCredentials().getEmail());
        emailDTO.setTitle("Account Deleted");
        emailDTO.setBody("Oops!! your account has been deleted by us.\n" +
                "if this is a mistake, please contact to our employees");
        emailService.sendAccountCreationEmail(emailDTO);
        agentRepository.save(agent);
        return true;
    }

    private Agent findAgentById(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(()->new UserException("agent not found"));
    }

    @Override
    public Boolean activateAgent(Long agentId) {
        accessConService.checkEmployeeAccess();
        Agent agent=findAgentById(agentId);
        if(agent.getIsActive()) throw new UserException("agent is already activated");
        agent.setIsActive(true);

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(agent.getCredentials().getEmail());
        emailDTO.setTitle("Account activated");
        emailDTO.setBody("Congrats!! your account has been activated by admin.\n" +
                "your username is " + agent.getCredentials().getUsername() +
                "\nPlease Start working to get new customers to us.");
        emailService.sendAccountCreationEmail(emailDTO);
        agentRepository.save(agent);
        return true;
    }
    
    
    
	@Override
	public Boolean approveAgent(Long agentId, Boolean isApproved) {
        accessConService.checkAdminAccess();
		Agent agent=findAgentById(agentId);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(agent.getCredentials().getEmail());
        if(isApproved){
            agent.setIsApproved(true);
            agentRepository.save(agent);

            emailDTO.setTitle("Agent Approved");
            emailDTO.setBody("Congrats!! your account has been activated by admin.\n" +
                    " Now, you are an agent of our company\n" +
                    "your username is " + agent.getCredentials().getUsername() +
                    "\nPlease Start working to get new customers to us.");
        }
        else{
            emailDTO.setTitle("Agent Not Approved");
            emailDTO.setBody("Oops!! your registration request has been rejected by admin.\n");
        }

        emailService.sendAccountCreationEmail(emailDTO);
//		send email to agent
		return true;
	}

    @Override
    public DashBoardDTO agentDashboard() {
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        Agent agent=findAgent(customUserDetails.getId());
        Long accounts= (long) agent.getPolicyAccounts().size();
        Long activeAccountsCount=agent.getPolicyAccounts().
                stream().
                filter(account->account.getIsActive()).count();
        Long inactiveAccounts=accounts-activeAccountsCount;

        Long withdrawals= (long) agent.getWithdrawalRequests().size();

        Long approvedWithdrawals=agent.getWithdrawalRequests().
                stream().
                filter(account->account.getIsApproved()).count();
        Long notApprovedWithdrawals=withdrawals-approvedWithdrawals;


        return new DashBoardDTO(accounts,activeAccountsCount,inactiveAccounts,withdrawals,approvedWithdrawals,notApprovedWithdrawals);
    }

    @Override
    public Boolean inActivateAgent(Long agentId) {
        return null;
    }

    @Override
    public PagedResponse<AgentDTO> getAllActiveAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkEmployeeAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Agent> agentPage = agentRepository.findAlByIsActiveTrue(pageable);
        List<Agent> agents = agentPage.getContent();
        List<AgentDTO> agentDTOS=dtoService.convertAgentsToDto(agents);
        return new PagedResponse<>(agentDTOS, agentPage.getNumber(),
                agentPage.getSize(), agentPage.getTotalElements(), agentPage.getTotalPages(),
                agentPage.isLast());
    }

    @Override
    public PagedResponse<AgentDTO> getAllInActiveAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkEmployeeAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Agent> agentPage = agentRepository.findAllByIsActiveFalse(pageable);
        List<Agent> agents = agentPage.getContent();
        List<AgentDTO> agentDTOS=dtoService.convertAgentsToDto(agents);
        return new PagedResponse<>(agentDTOS, agentPage.getNumber(),
                agentPage.getSize(), agentPage.getTotalElements(), agentPage.getTotalPages(),
                agentPage.isLast());
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllApprovedCommissions(Long agentId, int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkAgentAccess(agentId);
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        String role=accessConService.getUserRole();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<WithdrawalRequests> withdrawalRequestsPage;
        if(role.equals("AGENT")){
            CustomUserDetails customUserDetails=accessConService.checkUserAccess();
            Agent agent=findAgent(customUserDetails.getId());
            withdrawalRequestsPage = withdrawalRequestsRepository.findByAgentAndIsApprovedTrue(agent,pageable);
        }
        else{
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedTrue(pageable);
        }
        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=dtoService.convertWithdrawalsToDto(withdrawalRequests);
        return new PagedResponse<>(withdrawalRequestsDTOS, withdrawalRequestsPage.getNumber(),
                withdrawalRequestsPage.getSize(), withdrawalRequestsPage.getTotalElements(), withdrawalRequestsPage.getTotalPages(),
                withdrawalRequestsPage.isLast());
    }

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllNotApprovedCommissions(Long agentId, int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkAgentAccess(agentId);
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        String role=accessConService.getUserRole();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<WithdrawalRequests> withdrawalRequestsPage;
        if(role.equals("AGENT")){
            CustomUserDetails customUserDetails=accessConService.checkUserAccess();
            Agent agent=findAgent(customUserDetails.getId());
            withdrawalRequestsPage = withdrawalRequestsRepository.findByAgentAndIsApprovedFalse(agent,pageable);
        }
        else{
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedFalse(pageable);
        }
        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS=dtoService.convertWithdrawalsToDto(withdrawalRequests);
        return new PagedResponse<>(withdrawalRequestsDTOS, withdrawalRequestsPage.getNumber(),
                withdrawalRequestsPage.getSize(), withdrawalRequestsPage.getTotalElements(), withdrawalRequestsPage.getTotalPages(),
                withdrawalRequestsPage.isLast());
    }

    @Override
    public BalanceDTO getAgentBalance() {
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        Agent agent=findAgent(customUserDetails.getId());
        return new BalanceDTO(agent.getBalance(),agent.getWithdrawalAmount());
    }

    @Override
    public PagedResponse<TransactionsDTO> getAllTransactions(int pageNo, int size, String sort, String sortBy,
                                                             String sortDirection) {

        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        accessConService.checkAgentAccess(customUserDetails.getId());
        Agent agent=findAgent(customUserDetails.getId());
        List<Transactions> transactions = agent.getPolicyAccounts().stream()
                .flatMap(policyAccount -> policyAccount.getTransactions().stream())
                .toList();
        if(transactions.isEmpty()){
            List<TransactionsDTO> transactionsDTOS=new ArrayList<>();

            return new PagedResponse<>(transactionsDTOS, 0,
                    0, 0, 0,
                   true);
        }


        PageResult pageResult = dtoService.convertTransactionsToPage(transactions, pageNo, sort, sortBy, sortDirection, size);
        List<TransactionsDTO> customerDto = dtoService.convertTransactionListEntityToDTO(pageResult.getContent());
        int end = pageResult.getTotalElements();
        return new PagedResponse<>(
                customerDto,
                pageNo,
                size,
                transactions.size(),
                (transactions.size() + size - 1) / size,
                end == transactions.size()
        );
    }
}
