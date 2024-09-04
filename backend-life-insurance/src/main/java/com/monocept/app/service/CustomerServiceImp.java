package com.monocept.app.service;

import com.monocept.app.dto.AddressDTO;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.entity.Feedback;
import com.monocept.app.entity.Policy;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Query;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.State;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AddressRepository;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.FeedbackRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.PolicyRepository;
import com.monocept.app.repository.QueryRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.StateRepository;

import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.PagedResponse;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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
    private FeedbackRepository feedbackRepository;
    
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
	public Long 
  (@Valid RegistrationDTO registrationDTO) {
        Customer customer=dtoService.convertCustomerDtoToCustomer(registrationDTO);
        customer=customerRepository.save(customer);
        Address address=checkAndGetAddress(registrationDTO.getAddress());
        customer.setAddress(address);
        customer=customerRepository.save(customer);
        return customer.getCustomerId();
	}

    @Override
    public CustomerDTO getCustomerProfile() {
        return null;
    }

    @Override
    public PagedResponse<CustomerDTO> getAllCustomers() {
        return null;
    }

    @Override
    public CustomerDTO updateCustomerProfile(CustomerDTO customerDTO) {
        return null;
    }
//    @Override
//    public CustomerProfileResponseDTO getCustomerProfile() {
//        return null;
//    }
//
//    @Override
//    public CustomerProfileResponseDTO updateCustomerProfile(CustomerDTO customerDTO) {
//        return null;
//    }
//
//    @Override
//    public CustomerProfileResponseDTO getAllCustomers() {
//        return null;
//    }

    private Address checkAndGetAddress(AddressDTO addressDTO) {
        Address address=new Address();
        if(checkStateAndCity(addressDTO)){
            State state=stateRepository.findByStateName(addressDTO.getState());
            City city=cityRepository.findByCityName(addressDTO.getCity());
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
  
	public AddressDTO updateCustomerAddress(AddressDTO addressDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    if (!customer.getCustomerId().equals(addressDTO.getCustomerId())) {
	        throw new UserException("Unauthorized action: You can only update your own address.");
	    }
	    
	    Address currentAddress = customer.getAddress();
	    
	    currentAddress.setFirstStreet(addressDTO.getFirstStreet());
	    currentAddress.setLastStreet(addressDTO.getLastStreet());
	    currentAddress.setPincode(addressDTO.getPincode());
	    
	    if (!currentAddress.getState().getStateName().equals(addressDTO.getState())) {
	        State newState = stateRepository.findByStateName(addressDTO.getState())
	                .orElseThrow(() -> new UserException("State not found"));
	        currentAddress.setState(newState);
	    }

	    if (!currentAddress.getCity().getCityName().equals(addressDTO.getCity())) {
	        City newCity = cityRepository.findByCityName(addressDTO.getCity())
	                .orElseThrow(() -> new UserException("City not found"));
	        currentAddress.setCity(newCity);
	    }
	    
	    customerRepository.save(customer);

	    return dtoService.convertEntityToAddressDTO(currentAddress);
	}


	@Override
	public QueryDTO addQuery(QueryDTO queryDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    queryDTO.setQueryId(0L);
	    Query newQuery = dtoService.convertQueryDTOToEntity(queryDTO);
	    newQuery.setIsResolved(false);
	    newQuery.setCustomer(customer);
	    
	    Query savedQuery = queryRepository.save(newQuery);
	    customer.getQueries().add(savedQuery);
	    
	    return dtoService.convertQueryToQueryDTO(savedQuery);
	    
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
	public FeedbackDTO addFeedback(FeedbackDTO feedbackDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    feedbackDTO.setFeedbackId(0L);
	    Feedback newFeedback = dtoService.convertFeedbackDTOToEntity(feedbackDTO);
	    newFeedback.setCustomer(customer);
	    
	    Feedback savedFeedback = feedbackRepository.save(newFeedback);
	    customer.getFeedbacks().add(savedFeedback);
	    
	    return dtoService.convertFeedbackToFeedbackDTO(savedFeedback);
	    
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
	    
	    List<DocumentNeeded> requiredDocuments = policy.getDocumentsNeeded();
	    List<DocumentUploaded> customerDocuments = customer.getDocuments();
	    
	    if (!customerDocuments.containsAll(requiredDocuments)) {
	        throw new UserException("Customer does not have all required documents for the policy");
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
	        policyAccount.setAgent(agent);
	    }
	    
	    PolicyAccount savedPolicyAccount = policyAccountRepository.save(policyAccount);
	    
	    policy.getPolicyAccounts().add(savedPolicyAccount);
	    customer.getPolicyAccounts().add(savedPolicyAccount);
	    if (policyAccountDTO.getAgentId() != null) {
	        Agent agent = agentRepository.findById(policyAccountDTO.getAgentId())
	                .orElseThrow(() -> new UserException("Agent not found"));
	        agent.getPolicyAccounts().add(savedPolicyAccount);
	    }
	    
	    return dtoService.convertPolicyAccountToPolicyAccountDTO(savedPolicyAccount);
	    
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
	
}
