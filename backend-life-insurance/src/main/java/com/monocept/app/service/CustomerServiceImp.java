package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.Address;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.entity.Policy;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Query;
import com.monocept.app.entity.Role;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.State;
import com.monocept.app.entity.Transactions;
import com.monocept.app.entity.WithdrawalRequests;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AddressRepository;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.AuthRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.DocumentUploadedRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.PolicyRepository;
import com.monocept.app.repository.QueryRepository;
import com.monocept.app.repository.RoleRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.StateRepository;

import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.repository.WithdrawalRequestsRepository;
import com.monocept.app.utils.DocumentType;
import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.NomineeRelation;
import com.monocept.app.utils.PagedResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CustomerServiceImp implements CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private DtoService dtoService;
    @Autowired
    private StateRepository stateRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AccessConService accessConService;

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private PolicyAccountRepository policyAccountRepository;

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private SettingsRepository settingsRepository;

    @Autowired
    private StorageService storageService;
    
    @Autowired
    private AuthRepository credentialsRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WithdrawalRequestsRepository withdrawalRequestsRepository;
    
    @Autowired
    private  DocumentUploadedRepository documentUploadedRepository;
    
    @Autowired
    private EmailService emailService;

    public CustomerServiceImp(CustomerRepository customerRepository, DtoService dtoService,
                              StateRepository stateRepository, CityRepository cityRepository,
                              AddressRepository addressRepository) {
        this.customerRepository = customerRepository;
        this.dtoService = dtoService;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public CustomerDTO getCustomerProfile(Long customerId) {
        accessConService.checkCustomerAccess(customerId);
        String role = accessConService.getUserRole();
        if (role.equals("AGENT")) {
            isHisCustomer(customerId);
        }
        Customer customer = findCustomerById(customerId);


        return dtoService.convertCustomerToCustomerResponseDTO(customer);
    }

    private void isHisCustomer(Long customerId) {
        CustomUserDetails customUserDetails = accessConService.checkUserAccess();
        Agent agent = findAgentById(customUserDetails.getId());

        boolean isSuccess = agent.getPolicyAccounts().stream().anyMatch(account ->
                account.getCustomer().getCustomerId().equals(customerId)
        );
        if (!isSuccess) {
            throw new UserException("this is not your customer");
        }
    }

    private Agent findAgentById(Long id) {
        return agentRepository.findById(id).orElseThrow(() -> new UserException("agent not found"));
    }

    @Override
    public CustomerDTO updateCustomerProfile(CustomerDTO customerDTO) {
        CustomUserDetails userDetails = accessConService.checkUserAccess();
        accessConService.checkCustomerAccess(userDetails.getId());
        // Find the customer by ID
        Customer customer = findCustomerById(userDetails.getId());

        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setGender(customerDTO.getGender());
        customer.setIsActive(customerDTO.getIsActive());
        customer.setNomineeName(customerDTO.getNomineeName());
        customer.setNomineeRelation(customerDTO.getNomineeRelation());
        customer.setIsApproved(customerDTO.getIsApproved());
        customer.getCredentials().setUsername(customerDTO.getCredentials().getUsername());
        customer.getCredentials().setEmail(customerDTO.getCredentials().getEmail());
        customer.getCredentials().setMobileNumber(customerDTO.getCredentials().getMobileNumber());

        Customer updatedCustomer = customerRepository.save(customer);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(updatedCustomer.getCredentials().getEmail());
        emailDTO.setTitle("Profile updated");
        emailDTO.setBody("your profile has been updated, now we will verify your profile from our end, it could take some time" +
                "your username is " + updatedCustomer.getCredentials().getUsername());
        emailService.sendAccountCreationEmail(emailDTO);

        return dtoService.convertCustomerToCustomerResponseDTO(updatedCustomer);
    }


    @Override
    public Long customerRegistration(RegistrationDTO registrationDTO) {
    	
    	if (credentialsRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new UserException("Username must be unique");
        }

        if (credentialsRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new UserException("Email must be unique");
        }
        
        
        Customer customer = new Customer();
        customer.setFirstName(registrationDTO.getFirstName());
        customer.setLastName(registrationDTO.getLastName());
        customer.setDateOfBirth(registrationDTO.getDateOfBirth());
        customer.setGender(GenderType.valueOf(registrationDTO.getGender()));
        customer.setIsActive(true);
        customer.setNomineeName(registrationDTO.getNomineeName());
        customer.setNomineeRelation(NomineeRelation.valueOf(registrationDTO.getNomineeRelation()));
        customer.setIsApproved(true);

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
        customer.setAddress(address);

        Credentials credentials = new Credentials();
        credentials.setUsername(registrationDTO.getUsername());
        credentials.setEmail(registrationDTO.getEmail());
        credentials.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        credentials.setMobileNumber(registrationDTO.getMobileNumber());
        credentials.setCustomer(customer);

        Role role = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
        credentials.setRole(role);

        customer.setCredentials(credentials);
        credentials = credentialsRepository.save(credentials);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(credentials.getEmail());
        emailDTO.setTitle("Registration Success");
        emailDTO.setBody("Congrats!! you have registered with our company as an customer.\n" +
                " Now, you can purchase our schemes" +
                "your username is " + credentials.getUsername());
        
        emailService.sendAccountCreationEmail(emailDTO);

        return credentials.getCustomer().getCustomerId();
    }

    private boolean checkStateAndCity(AddressDTO addressDTO) {
        String state = addressDTO.getState();
        Boolean isState = stateRepository.existsByStateNameAndIsActiveTrue(state);
        String city = addressDTO.getCity();
        Boolean isCity = cityRepository.existsByCityNameAndIsActiveTrue(state);
        return isCity && isState;
    }

    @Override
    public PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        String role = accessConService.getUserRole();
        Page<Query> pages;
        if (role.equals("CUSTOMER")) {
            CustomUserDetails customUserDetails = accessConService.checkUserAccess();
            Customer customer = findCustomerById(customUserDetails.getId());
            pages = queryRepository.findByIsResolvedTrueAndCustomer(pageable, customer);
        } else {
            pages = queryRepository.findByIsResolvedTrue(pageable);
        }

        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


    @Override
    public PagedResponse<PolicyAccountDTO> getAllPolicyAccounts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        CustomUserDetails userDetails = accessConService.checkUserAccess();
        String role = accessConService.getUserRole();
        Page<PolicyAccount> pages;
        if (role.equals("CUSTOMER")) {
            Customer customer = findCustomerById(userDetails.getId());
            pages = policyAccountRepository.findByCustomer(customer, pageable);
        } else if (role.equals("AGENT")) {
            Agent agent = findAgentById(userDetails.getId());
            pages = policyAccountRepository.findByAgent(agent, pageable);
        } else {
            pages = policyAccountRepository.findAll(pageable);
        }

        List<PolicyAccount> allPolicyAccounts = pages.getContent();
        List<PolicyAccountDTO> allPolicyAccountDTO = dtoService.convertPolicyAccountListEntityToDTO(allPolicyAccounts);

        return new PagedResponse<>(allPolicyAccountDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());

    }


    @Override
    public PolicyAccountDTO getPolicyAccountByAccountNumber(Long id) {
        CustomUserDetails userDetails = accessConService.checkUserAccess();
        String role = accessConService.getUserRole();
        checkAccountAccess(userDetails, id, role);
        PolicyAccount policyAccount = policyAccountRepository.findById(id).
                orElseThrow(() -> new UserException("account not found"));
        return dtoService.convertPolicyAccountToPolicyAccountDTO(policyAccount);
    }

    private void checkAccountAccess(CustomUserDetails userDetails, Long accountId, String role) {
        if (role.equals("AGENT")) {
            Agent agent = findAgentById(userDetails.getId());
            boolean isSuccess = agent.getPolicyAccounts().stream().
                    anyMatch(account -> account.getPolicyAccountId().equals(accountId));
            if (!isSuccess) throw new UserException("this is not your customer account");
        }
        if (role.equals("CUSTOMER")) {
            Customer customer = findCustomerById(userDetails.getId());
            boolean isSuccess = customer.getPolicyAccounts().stream().
                    anyMatch(account -> account.getPolicyAccountId().equals(accountId));
            if (!isSuccess) throw new UserException("this is not your account");
        }
    }


    @Override
    public PolicyAccountDTO createPolicyAccount(PolicyAccountDTO policyAccountDTO) {
        String role = accessConService.getUserRole();
        if (!role.equals("CUSTOMER")) throw new UserException("only customer can create account");

        CustomUserDetails userDetails = accessConService.checkUserAccess();

        Customer customer = findCustomerById(userDetails.getId());

        System.out.print(policyAccountDTO);
        Policy policy = policyRepository.findById(policyAccountDTO.getPolicyId())
                .orElseThrow(() -> new UserException("Policy not found"));
        
        
        checkEligibility(customer, policy, policyAccountDTO);

        policyAccountDTO.setPolicyAccountId(0L);
        PolicyAccount policyAccount = dtoService.convertPolicyAccountDtoToPolicyAccount(policyAccountDTO);

        LocalDate maturedDate = LocalDate.now().plusYears(policyAccountDTO.getPolicyTerm());
        policyAccount.setMaturedDate(maturedDate);
        policyAccount.setIsActive(true);

        int totalMonths = policyAccountDTO.getPolicyTerm() * 12;
        int numberOfPayments = totalMonths / policyAccountDTO.getPaymentTimeInMonths();
        Double balancePerPayment = policyAccountDTO.getInvestmentAmount() / numberOfPayments;
        policyAccount.setTimelyBalance(balancePerPayment);
        policyAccount.setTotalAmountPaid(balancePerPayment);

        Double claimAmount = policyAccountDTO.getInvestmentAmount() * (1 + policy.getProfitRatio() / 100);
        claimAmount = Double.valueOf(String.format("%.2f", claimAmount));
        policyAccount.setClaimAmount(claimAmount);
        policyAccount.setPolicy(policy);
        policyAccount.setCustomer(customer);

        Agent agent = null;
        if (policyAccountDTO.getAgentId() != null) {
            agent = agentRepository.findById(policyAccountDTO.getAgentId())
                    .orElseThrow(() -> new UserException("Agent not found"));

            if (customer.getAddress().getState().getStateId().equals(agent.getAddress().getState().getStateId())) {
                policyAccount.setAgent(agent);


                Double commission = ((policy.getCommissionNewRegistration() / 100) * policyAccountDTO.getInvestmentAmount());

                policyAccount.setAgentCommissionForRegistration(commission);
            } else {
                policyAccount.setAgent(null);
            }
        }
        

        PolicyAccount savedPolicyAccount = policyAccountRepository.save(policyAccount);
        
        createFutureTransactions(savedPolicyAccount, policyAccountDTO.getPaymentTimeInMonths(), balancePerPayment, policyAccountDTO.getTransactionId(), agent, policy.getCommissionInstallment(), policyAccountDTO.getPaymentMade());

        if (policy.getPolicyAccounts() != null) policy.getPolicyAccounts().add(savedPolicyAccount);
        else policy.setPolicyAccounts(addFirstPolicyAccount(savedPolicyAccount));

        if (customer.getPolicyAccounts() != null) customer.getPolicyAccounts().add(savedPolicyAccount);
        else customer.setPolicyAccounts(addFirstPolicyAccount(savedPolicyAccount));

        customerRepository.save(customer);
        policyRepository.save(policy);
        
        
        if (agent != null) {
            if (agent.getPolicyAccounts() != null) {
                agent.getPolicyAccounts().add(savedPolicyAccount);
            } else {
                agent.setPolicyAccounts(addFirstPolicyAccount(savedPolicyAccount));
            }
            agentRepository.save(agent);
        }

        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(customer.getCredentials().getEmail());
        emailDTO.setTitle("Policy account Created Successfully");
        emailDTO.setBody("Congrats!! your Policy account has been created.\n" +
                " Now, you can do transactions as per your accommodation" +
                " please complete your transactions as per allocated time by you to avoid penalties");
        emailService.sendAccountCreationEmail(emailDTO);

        return dtoService.convertPolicyAccountToPolicyAccountDTO(savedPolicyAccount);
    }

    private List<PolicyAccount> addFirstPolicyAccount(PolicyAccount savedPolicyAccount) {
        List<PolicyAccount> policyAccounts = new ArrayList<>();
        policyAccounts.add(savedPolicyAccount);
        return policyAccounts;
    }

    private void checkEligibility(Customer customer, Policy policy, PolicyAccountDTO policyAccountDTO) {
        if (!policy.getIsActive()) {
            throw new UserException("The policy is not active");
        }

        // Validate the policy term and investment amount
        if (policyAccountDTO.getPolicyTerm() < policy.getMinPolicyTerm() ||
                policyAccountDTO.getPolicyTerm() > policy.getMaxPolicyTerm()) {
            throw new UserException("Policy term is not within the allowed range");
        }

        if (policyAccountDTO.getInvestmentAmount() < policy.getMinInvestmentAmount() ||
                policyAccountDTO.getInvestmentAmount() > policy.getMaxInvestmentAmount()) {
            throw new UserException("Investment amount is not within the allowed range");
        }

        // Validate the customer's age
        int age = LocalDate.now().getYear() - customer.getDateOfBirth().getYear();
        if (age < policy.getMinAge() || age > policy.getMaxAge()) {
            throw new UserException("Customer's age is not within the allowed range for this policy");
        }

        // Validate the customer's gender
        if (!policy.getEligibleGender().equalsIgnoreCase("BOTH") &&
                !policy.getEligibleGender().equalsIgnoreCase(customer.getGender().toString())) {
            throw new UserException("Customer's gender is not eligible for this policy");
        }
        List<DocumentNeeded> requiredDocuments = policy.getDocumentsNeeded();
        List<DocumentUploaded> customerDocuments = customer.getDocuments();

        for (DocumentNeeded requiredDocument : requiredDocuments) {
            boolean documentApproved = customerDocuments.stream()
                    .filter(doc -> doc.getDocumentId().equals(requiredDocument.getDocumentId()))
                    .anyMatch(DocumentUploaded::getIsApproved);

            if (!documentApproved) {
                throw new UserException("Customer does not have all required approved documents for the policy");
            }
        }
    }

    private void createFutureTransactions(PolicyAccount policyAccount, int paymentTimeInMonths, Double balancePerPayment, String trasactionIdentification, Agent agent, float commission, Double totalAmountPaid) {
        LocalDate currentDate = LocalDate.now();
        LocalDate nextPaymentDate = currentDate.plusMonths(paymentTimeInMonths);

        // Create the initial payment
        Transactions initialPayment = new Transactions();
        initialPayment.setAmount(balancePerPayment);
        initialPayment.setTransactionDate(currentDate);
        initialPayment.setStatus("Done");
        initialPayment.setSerialNo(1L);
        Long position = 2L;
        initialPayment.setPolicyAccount(policyAccount);
        initialPayment.setTransactionIdentification(trasactionIdentification);
        initialPayment.setTotalAmountPaid(totalAmountPaid);
        initialPayment.setLateCharges(false);
        initialPayment.setTransactionPaidDate(LocalDateTime.now());
        if(agent != null) {
        	Double commissionFull = (balancePerPayment*commission)/100;
        	initialPayment.setAgentCommission(commissionFull);
        }
        transactionsRepository.save(initialPayment);

        // Create future scheduled payments
        while (nextPaymentDate.isBefore(policyAccount.getMaturedDate())) {
            Transactions transaction = new Transactions();
            transaction.setAmount(balancePerPayment);
            transaction.setTransactionDate(nextPaymentDate);
            transaction.setStatus("Pending");
            transaction.setSerialNo(position);
            position += 1L;
            transaction.setPolicyAccount(policyAccount);
            transactionsRepository.save(transaction);

            // Move to the next payment date
            nextPaymentDate = nextPaymentDate.plusMonths(paymentTimeInMonths);
        }
    }



	@Override
	public void createInstallmentPayment(InstallmentDTO installmentDTO) {
		Transactions transaction = transactionsRepository.findById(installmentDTO.getTransactionId()).orElseThrow(()->new UserException("Transaction Not found"));
		
		PolicyAccount policyAccount = transaction.getPolicyAccount();
		
		transaction.setLateCharges(installmentDTO.getLateCharges());
		transaction.setTransactionIdentification(installmentDTO.getTransactionIdentification());
		transaction.setTotalAmountPaid(installmentDTO.getTotalAmountPaid());
		transaction.setStatus("Done");
		transaction.setTransactionPaidDate(LocalDateTime.now());
		
		System.out.println(policyAccount.getTotalAmountPaid());
		System.out.println(transaction.getAmount());
		policyAccount.setTotalAmountPaid(policyAccount.getTotalAmountPaid()+transaction.getAmount());
		
		if(policyAccount.getAgent() != null) {
        	Double commissionFull = (transaction.getAmount()*policyAccount.getPolicy().getCommissionInstallment())/100;
        	transaction.setAgentCommission(commissionFull);
        }
		
		
		policyAccountRepository.save(policyAccount);
		
	}


    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsRequest(int pageNo, int size, String sort,
                                                                          String sortBy, String sortDirection, Long customerId) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        String role = accessConService.getUserRole();
        CustomUserDetails customUserDetails = accessConService.checkUserAccess();
        Page<WithdrawalRequests> withdrawalRequestsPage;
        if (role.equals("CUSTOMER")) {
            Customer customer = findCustomerById(customUserDetails.getId());
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByCustomer(customer, pageable);
        } else if (role.equals("AGENT")) {
            Agent agent = findAgentById(customUserDetails.getId());
            List<PolicyAccount> policyAccounts=policyAccountRepository.findAllByAgent(agent);
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByPolicyAccountIn(policyAccounts, pageable);
        } else withdrawalRequestsPage = withdrawalRequestsRepository.findAll(pageable);

        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS = dtoService.convertWithdrawalsToDto(withdrawalRequests);
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
        String role = accessConService.getUserRole();
        CustomUserDetails customUserDetails = accessConService.checkUserAccess();
        Page<WithdrawalRequests> withdrawalRequestsPage;
        if (role.equals("CUSTOMER")) {
            Customer customer = findCustomerById(customUserDetails.getId());
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedTrueAndCustomer(customer, pageable);
        } else if (role.equals("AGENT")) {
            Agent agent = findAgentById(customUserDetails.getId());
            withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedTrueAndAgent(agent, pageable);
        } else withdrawalRequestsPage = withdrawalRequestsRepository.findAllByIsApprovedTrue(pageable);

        List<WithdrawalRequests> withdrawalRequests = withdrawalRequestsPage.getContent();
        List<WithdrawalRequestsDTO> withdrawalRequestsDTOS = dtoService.convertWithdrawalsToDto(withdrawalRequests);
        return new PagedResponse<>(withdrawalRequestsDTOS, withdrawalRequestsPage.getNumber(),
                withdrawalRequestsPage.getSize(), withdrawalRequestsPage.getTotalElements(), withdrawalRequestsPage.getTotalPages(),
                withdrawalRequestsPage.isLast());
    }


    @Override
    public Boolean deleteCustomer(Long customerId) {
        accessConService.checkEmployeeAccess();
        Customer customer = findCustomerById(customerId);
        if (!customer.getIsActive()) throw new UserException("customer is already deleted");
        customer.setIsActive(false);
        customerRepository.save(customer);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(customer.getCredentials().getEmail());
        emailDTO.setTitle("Account deleted");
        emailDTO.setBody("Oops!! your account has been deleted.\n" +
                "if this is a mistake please contact your agent");
        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }


    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new UserException("customer not found"));
    }


    @Override
    public Boolean activateCustomer(Long customerId) {
        accessConService.checkEmployeeAccess();
        Customer customer = findCustomerById(customerId);
        if (customer.getIsActive()) throw new UserException("customer is already activated");
        customer.setIsActive(true);
        customerRepository.save(customer);
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(customer.getCredentials().getEmail());
        emailDTO.setTitle("Account activated");
        emailDTO.setBody("Congrats!! your account has been activated as per your request.\n" +
                " Now, you can do login to your account");
        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }

    // agent can't access this service
    @Override
    public PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkEmployeeAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> customerPage = customerRepository.findAllByIsActiveTrue(pageable);
        List<Customer> customers = customerPage.getContent();
        List<CustomerDTO> customerDTOS = dtoService.convertCustomersToDto(customers);
        return new PagedResponse<>(customerDTOS, customerPage.getNumber(),
                customerPage.getSize(), customerPage.getTotalElements(), customerPage.getTotalPages(),
                customerPage.isLast());
    }

    @Override
    public PagedResponse<CustomerDTO> getAllInActiveCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        accessConService.checkEmployeeAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> customerPage = customerRepository.findAllByIsActiveFalse(pageable);
        List<Customer> customers = customerPage.getContent();
        List<CustomerDTO> customerDTOS = dtoService.convertCustomersToDto(customers);
        return new PagedResponse<>(customerDTOS, customerPage.getNumber(),
                customerPage.getSize(), customerPage.getTotalElements(), customerPage.getTotalPages(),
                customerPage.isLast());
    }

	@Override
	public CustomerCreationDTO getCustomerFullProfile(Long customerId) {
		Customer customer = findCustomerById(customerId);
		
		return dtoService.convertCustomerToCustomerCreationDTO(customer);
	}

	@Override
	public CustomerCreationDTO updateCustomer(CustomerCreationDTO customerDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();
        accessConService.checkCustomerAccess(userDetails.getId());
        // Find the customer by ID
        Customer customer = findCustomerById(userDetails.getId());
        
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setGender(customerDTO.getGender());
        customer.setNomineeName(customerDTO.getNomineeName());
        customer.setNomineeRelation(customerDTO.getNomineeRelation());
        customer.getCredentials().setUsername(customerDTO.getUsername());
        customer.getCredentials().setEmail(customerDTO.getEmail());
        customer.getCredentials().setMobileNumber(customerDTO.getMobileNumber());
        
        customer = customerRepository.save(customer);
        
        return dtoService.convertCustomerToCustomerCreationDTO(customer);
	}

	@Override
	public List<DocumentUploadedDTO> getDocumentsOfCustomer(Long customerId) {
		Customer customer = findCustomerById(customerId);
		
		List<DocumentUploaded> documents = documentUploadedRepository.findByCustomer(customer);
		
		List<DocumentUploadedDTO> documentsDTO = dtoService.convertDocumentUploadedListToDTO(documents);
		
		return documentsDTO;
		
	}

	@Override
	public String addOrUpdateDocumentsOfCustomer(Long customerId, String documentName, MultipartFile file) {
		try {
			Customer customer = findCustomerById(customerId);
			
            DocumentType documentType = DocumentType.valueOf(documentName.toUpperCase());
            
            DocumentUploaded documentUploaded = documentUploadedRepository.findByDocumentTypeAndCustomer(documentType, customer);
            
            if (documentUploaded == null) {
            	DocumentUploadedDTO documentUploadedDTO = new DocumentUploadedDTO();
            	documentUploadedDTO.setDocumentType(documentName);
            	documentUploadedDTO.setIsApproved(false);
            	documentUploadedDTO.setCustomerId(customerId);
            	storageService.addUserDocuments(documentUploadedDTO, file);
            	
            	return "New Document uploaded successfully";
            }
            else {
            	storageService.updateUserDocuments(customer, documentUploaded, file);
            	
            	return "Document uploaded successfully. wait for verification";
            }
            

        } catch (IllegalArgumentException e) {
            // If documentType is not valid, throw an error
            throw new UserException("Invalid document type: " + documentName);
        }
	}

	@Override
	public List<DocumentUploadedDTO> getApprovedDocumentsOfCustomer(Long customerId) {
		Customer customer = findCustomerById(customerId);
		
		List<DocumentUploaded> documents = documentUploadedRepository.findByCustomerAndIsApprovedTrue(customer);
		
		List<DocumentUploadedDTO> documentsDTO = dtoService.convertDocumentUploadedListToDTO(documents);
		
		return documentsDTO;
	}



}
