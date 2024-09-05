package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.Address;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.entity.Feedback;
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
import com.monocept.app.repository.FeedbackRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.PolicyRepository;
import com.monocept.app.repository.QueryRepository;
import com.monocept.app.repository.RoleRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.StateRepository;

import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.repository.WithdrawalRequestsRepository;
import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.NomineeRelation;
import com.monocept.app.utils.PagedResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImp implements CustomerService{

    private CustomerRepository customerRepository;
    private DtoService dtoService;
    private StateRepository stateRepository;
    private CityRepository cityRepository;
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
    private AuthRepository credentialsRepository;
    
    @Autowired
	private RoleRepository roleRepository;
    
    @Autowired
	private PasswordEncoder passwordEncoder;
    
    @Autowired
    private WithdrawalRequestsRepository withdrawalRequestsRepository;

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
	public CustomerDTO getCustomerProfile() {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));


	    return dtoService.convertCustomerToCustomerResponseDTO(customer);
	}

	@Override
	public CustomerDTO updateCustomerProfile(CustomerDTO customerDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    // Find the customer by ID
	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));

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

	    return dtoService.convertCustomerToCustomerResponseDTO(updatedCustomer);
	}


	@Override
	public Long customerRegistration(RegistrationDTO registrationDTO) {
		Customer customer = new Customer();
        customer.setFirstName(registrationDTO.getFirstName());
        customer.setLastName(registrationDTO.getLastName());
        customer.setDateOfBirth(registrationDTO.getDateOfBirth());
        customer.setGender(GenderType.valueOf(registrationDTO.getGender()));
        customer.setIsActive(true);
        customer.setNomineeName(registrationDTO.getNomineeName());
        customer.setNomineeRelation(NomineeRelation.valueOf(registrationDTO.getNomineeRelation()));
        customer.setIsApproved(false);
        
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
        
        return credentials.getCustomer().getCustomerId();
	}

    private Address checkAndGetAddress(AddressDTO addressDTO) {
        Address address=new Address();
        if(checkStateAndCity(addressDTO)){
            State state=stateRepository.findByStateName(addressDTO.getState()).get();
            City city=cityRepository.findByCityName(addressDTO.getCity()).get();
            address.setCity(city);
            address.setState(state);
            address.setPincode(addressDTO.getPincode());
            address.setFirstStreet(addressDTO.getFirstStreet());
            address.setLastStreet(addressDTO.getLastStreet());
            return addressRepository.save(address);
        }
        return address;
    }
    private boolean checkStateAndCity(AddressDTO addressDTO) {
        String state=addressDTO.getState();
        Boolean isState= stateRepository.existsByStateNameAndIsActiveTrue(state);
        String city=addressDTO.getCity();
        Boolean isCity= cityRepository.existsByCityNameAndIsActiveTrue(state);
        return isCity && isState;
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
	public PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
			String direction, Long id) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
		
		PolicyAccount policyAccount = policyAccountRepository.findById(id)
		        .orElseThrow(() -> new UserException("Policy account not found"));
		
		if (!policyAccount.getCustomer().equals(customer)) {
	        throw new UserException("Policy account does not belong to the current customer");
	    }
		    
	    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);
	    
	    Page<Transactions> pages = transactionsRepository.findByPolicyAccount(policyAccount, pageable);
	    List<Transactions> allTransactions = pages.getContent();
	    List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);
	    
	    return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<PolicyAccountDTO> getAllPolicyAccounts(int page, int size, String sortBy, String direction) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);
	    
	    Page<PolicyAccount> pages = policyAccountRepository.findByCustomer(customer, pageable);
	    List<PolicyAccount> allPolicyAccounts = pages.getContent();
	    List<PolicyAccountDTO> allPolicyAccountDTO = dtoService.convertPolicyAccountListEntityToDTO(allPolicyAccounts);
	    
	    return new PagedResponse<PolicyAccountDTO>(allPolicyAccountDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
		
	}


	@Override
	public PagedResponse<PolicyAccountDTO> getPolicyAccountsByAccountNumber(int page, int size, String sortBy,
			String direction, Long id) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    PolicyAccount policyAccount = policyAccountRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy account not found"));

	    if (!policyAccount.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
	        throw new UserException("Policy account does not belong to the customer");
	    }
	    
	    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	    Pageable pageable = PageRequest.of(page, size, sort);
	    
	    Page<PolicyAccount> pages = policyAccountRepository.findByCustomerAndPolicyAccountId(customer, id, pageable);
	    List<PolicyAccount> allPolicyAccounts = pages.getContent();
	    List<PolicyAccountDTO> allPolicyAccountDTO = dtoService.convertPolicyAccountListEntityToDTO(allPolicyAccounts);
	    
	    return new PagedResponse<PolicyAccountDTO>(allPolicyAccountDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PolicyAccountDTO createPolicyAccount(PolicyAccountDTO policyAccountDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));

	    Policy policy = policyRepository.findById(policyAccountDTO.getPolicyId())
	            .orElseThrow(() -> new UserException("Policy not found"));
	    
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
	    
	    policyAccountDTO.setPolicyAccountId(0L);
	    PolicyAccount policyAccount = dtoService.convertPolicyAccountDtoToPolicyAccount(policyAccountDTO);
	    
	    LocalDate maturedDate = LocalDate.now().plusYears(policyAccountDTO.getPolicyTerm());
	    policyAccount.setMaturedDate(maturedDate);
	    policyAccount.setIsActive(true);
	    
	    int totalMonths = policyAccountDTO.getPolicyTerm() * 12;
	    int numberOfPayments = totalMonths / policyAccountDTO.getPaymentTimeInMonths();
	    Double balancePerPayment = policyAccountDTO.getInvestmentAmount() / numberOfPayments;
	    policyAccount.setTimelyBalance(balancePerPayment);
	    policyAccount.setTotalAmountPaid(0.0);
	    
	    Double claimAmount = policyAccountDTO.getInvestmentAmount() * (1 + policy.getProfitRatio() / 100);
	    policyAccount.setClaimAmount(claimAmount);
	    policyAccount.setPolicy(policy);
	    policyAccount.setCustomer(customer);
	    
	    if (policyAccountDTO.getAgentId() != null) {
	        Agent agent = agentRepository.findById(policyAccountDTO.getAgentId())
	                .orElseThrow(() -> new UserException("Agent not found"));

	        if (customer.getAddress().getState().getStateId().equals(agent.getAddress().getState().getStateId())) {
	            policyAccount.setAgent(agent);
	            

	            Double commission =  ((policy.getCommissionNewRegistration() / 100) * policyAccountDTO.getInvestmentAmount());
	            
	            policyAccount.setAgentCommissionForRegistration(commission);
	        } else {
	            policyAccount.setAgent(null);
	        }
	    }
	    
	    createFutureTransactions(policyAccount, policyAccountDTO.getPaymentTimeInMonths(), balancePerPayment);
	   
	    PolicyAccount savedPolicyAccount = policyAccountRepository.save(policyAccount);
	    
	    policy.getPolicyAccounts().add(savedPolicyAccount);
	    customer.getPolicyAccounts().add(savedPolicyAccount);
	    if (policyAccountDTO.getAgentId() != null) {
	        Agent agent = agentRepository.findById(policyAccountDTO.getAgentId())
	                .orElseThrow(() -> new UserException("Agent not found"));
	        if (customer.getAddress().getState().getStateId().equals(agent.getAddress().getState().getStateId())) {
	            policyAccount.setAgent(agent);
	        } else {
	            policyAccount.setAgent(null);
	        }
	    }
	    
	    return dtoService.convertPolicyAccountToPolicyAccountDTO(savedPolicyAccount);
	    
	}
	
	private void createFutureTransactions(PolicyAccount policyAccount, int paymentTimeInMonths, Double balancePerPayment) {
	    LocalDate currentDate = LocalDate.now();
	    LocalDate nextPaymentDate = currentDate.plusMonths(paymentTimeInMonths);

	    // Create the initial payment
	    Transactions initialPayment = new Transactions();
	    initialPayment.setAmount(balancePerPayment);
	    initialPayment.setTransactionDate(currentDate);
	    initialPayment.setStatus("pending");
	    initialPayment.setPolicyAccount(policyAccount);
	    transactionsRepository.save(initialPayment);

	    // Create future scheduled payments
	    while (nextPaymentDate.isBefore(policyAccount.getMaturedDate()) || nextPaymentDate.isEqual(policyAccount.getMaturedDate())) {
	        Transactions transaction = new Transactions();
	        transaction.setAmount(balancePerPayment);
	        transaction.setTransactionDate(nextPaymentDate);
	        transaction.setStatus("pending");
	        transaction.setPolicyAccount(policyAccount);
	        transactionsRepository.save(transaction);

	        // Move to the next payment date
	        nextPaymentDate = nextPaymentDate.plusMonths(paymentTimeInMonths);
	    }
	}



	@Override
	public Double paymentToPay(Long id, LocalDate paymentToBeMade) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();
	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));

	    PolicyAccount policyAccount = policyAccountRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy account not found"));

	    if (!policyAccount.getCustomer().equals(customer)) {
	        throw new UserException("Unauthorized access to this policy account");
	    }
	    
	    LocalDate currentDate = LocalDate.now();
	    LocalDate gracePeriod = paymentToBeMade.plusDays(15);
	    
	    Settings taxChargesSetting = settingsRepository.findBySettingKey(GlobalSettings.TAX_CHARGES)
	            .orElseThrow(() -> new UserException("Tax charges setting not found"));
	    Settings penaltyChargesSetting = settingsRepository.findBySettingKey(GlobalSettings.PENALTY_CHARGES)
	            .orElseThrow(() -> new UserException("Penalty charges setting not found"));

	    boolean isLate = currentDate.isAfter(gracePeriod);
	    Double penalty = 0.0;
	    
	    if (isLate) {
	        penalty = policyAccount.getTimelyBalance() * (penaltyChargesSetting.getSettingValue() / 100);
	    }
	    
	    Double totalAmountToPay = policyAccount.getTimelyBalance() + penalty;
	    Double taxCharges = totalAmountToPay * (taxChargesSetting.getSettingValue() / 100);
	    totalAmountToPay += taxCharges;
	    
	    return totalAmountToPay;
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






	
}
