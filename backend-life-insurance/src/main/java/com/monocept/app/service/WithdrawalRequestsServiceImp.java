package com.monocept.app.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Settings;
import com.monocept.app.entity.Transactions;
import com.monocept.app.entity.WithdrawalRequests;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AdminRepository;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.repository.TransactionsRepository;
import com.monocept.app.repository.WithdrawalRequestsRepository;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.PagedResponse;

@Service
public class WithdrawalRequestsServiceImp implements WithdrawalRequestsService{
	
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
    private CustomerRepository customerRepository;
	
	@Autowired
    private AccessConService accessConService;
	
	@Autowired
    private PolicyAccountRepository policyAccountRepository;
	
	@Autowired
    private WithdrawalRequestsRepository withdrawalRequestRepository;
	
	@Autowired
    private TransactionsRepository transactionRepository;
	
	@Autowired
    private SettingsRepository settingsRepository;
	
	@Autowired
    private AgentRepository agentRepository;
	
	@Autowired
    private AdminRepository adminRepository;

	@Override
	public WithdrawalRequestsDTO createWithdrawalRequestForCustomer(WithdrawalRequestsDTO withdrawalRequestDTO) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    PolicyAccount policyAccount = policyAccountRepository.findById(withdrawalRequestDTO.getPolicyAccountId())
	            .orElseThrow(() -> new UserException("Policy account not found"));
	    
	    
	    if (!policyAccount.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
	        throw new UserException("You are not authorized to request withdrawal for this policy account.");
	    }
	   
	    if (withdrawalRequestRepository.existsByPolicyAccountAndCustomer(policyAccount, customer)) {
	        throw new UserException("A withdrawal request has already been made for this policy account.");
	    }
	    
	    
	    String requestType = withdrawalRequestDTO.getRequestType();
	    Double calculatedAmount = 0.0;
	    
	    if ("CancelPolicy".equalsIgnoreCase(requestType)) {
	    	List<Transactions> transactions = transactionRepository.findByPolicyAccount(policyAccount);
	    	long doneTransactionsCount = transactions.stream()
	                .filter(transaction -> "done".equalsIgnoreCase(transaction.getStatus()))
	                .count();

	        if (doneTransactionsCount < 3) {
	            throw new UserException("At least 3 transactions with status 'done' are required to cancel the policy.");
	        }
	        
	        Double totalAmountPaid = policyAccount.getTotalAmountPaid();
	        
	        Settings settings = settingsRepository.findBySettingKey(GlobalSettings.CANCELLATION_CHARGES)
	                .orElseThrow(() -> new UserException("Error occurred try after some time"));
	        
	        Float cancellationCharges = settings.getSettingValue();

	        calculatedAmount = totalAmountPaid * (cancellationCharges/100);
	    } 
	    if ("ClaimMaturedPolicy".equalsIgnoreCase(requestType)) {
	        
	    	
	    	if (policyAccount.getMaturedDate().isAfter(LocalDate.now())) {
	            throw new UserException("The policy has not yet matured.");
	        }
	    	
	    	calculatedAmount = policyAccount.getClaimAmount();
	    }
	    
	    WithdrawalRequests withdrawalRequest = new WithdrawalRequests();
	    withdrawalRequest.setRequestType(requestType);
	    withdrawalRequest.setAmount(calculatedAmount);
	    withdrawalRequest.setIsWithdraw(false);
	    withdrawalRequest.setIsApproved(false);
	    withdrawalRequest.setPolicyAccount(policyAccount);
	    withdrawalRequest.setCustomer(customer);
	    
	    withdrawalRequest = withdrawalRequestRepository.save(withdrawalRequest);
	    
	    return dtoService.convertWithdrawalRequestToDTO(withdrawalRequest);
	}


	@Override
	public WithdrawalRequestsDTO createWithdrawalRequestForAgent(WithdrawalRequestsDTO withdrawalRequestDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Agent agent = agentRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Agent not found"));

	    PolicyAccount policyAccount = policyAccountRepository.findById(withdrawalRequestDTO.getPolicyAccountId())
	            .orElseThrow(() -> new UserException("Policy account not found"));

	    if (!policyAccount.getAgent().getAgentId().equals(agent.getAgentId())) {
            throw new UserException("You are not authorized to claim for this policy account.");
        }
	    
	    String requestType = withdrawalRequestDTO.getRequestType();
	    Double calculatedAmount = 0.0;
	    
	    if ("ClaimForPolicyRegistration".equalsIgnoreCase(requestType)) {
	    	
	    	if (withdrawalRequestRepository.existsByPolicyAccountAndRequestTypeAndAgent(policyAccount, requestType, agent)) {
	            throw new UserException("A withdrawal request with this type has already been made for this policy account.");
	        }
	    	
	    	List<Transactions> transactions = transactionRepository.findByPolicyAccount(policyAccount);

	        boolean hasDoneTransaction = transactions.stream()
	                .anyMatch(transaction -> "done".equalsIgnoreCase(transaction.getStatus()));

	        if (!hasDoneTransaction) {
	            throw new UserException("At least one transaction with status 'done' is required to claim for policy registration.");
	        }
	        
	        calculatedAmount = policyAccount.getAgentCommissionForRegistration();

	    }
        if ("ClaimForInstalment".equalsIgnoreCase(requestType)) {

        	Long transactionId = withdrawalRequestDTO.getTransactionId(); // Assuming transaction ID is provided in DTO
            Transactions transaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new UserException("Transaction not found"));

            if (!"done".equalsIgnoreCase(transaction.getStatus())) {
                throw new UserException("The transaction must have 'done' status to claim an instalment.");
            }

            if (withdrawalRequestRepository.existsByPolicyAccountAndRequestTypeAndAgentAndTransactionId(policyAccount, requestType, agent, transactionId)) {
	            throw new UserException("A withdrawal request with this type has already been made for this policy account.");
	        }
            calculatedAmount = transaction.getAgentCommission();

	    } 
        
        WithdrawalRequests withdrawalRequest = new WithdrawalRequests();
        withdrawalRequest.setRequestType(requestType);
        withdrawalRequest.setAmount(calculatedAmount);
        withdrawalRequest.setIsWithdraw(false);
        withdrawalRequest.setIsApproved(false);
        withdrawalRequest.setPolicyAccount(policyAccount);
        withdrawalRequest.setAgent(agent);
	    
        withdrawalRequest = withdrawalRequestRepository.save(withdrawalRequest);

        return dtoService.convertWithdrawalRequestToDTO(withdrawalRequest);
	    
	}


	@Override
	public Boolean approveOrRejectRequest(Long withDrawalRequestId, Boolean isApproved) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Adim not found"));
	    
	    WithdrawalRequests withdrawalRequest = withdrawalRequestRepository.findById(withDrawalRequestId)
	            .orElseThrow(() -> new UserException("Withdrawal request not found"));
	    
	    if (isApproved) {

	        withdrawalRequest.setIsApproved(true);
	        withdrawalRequestRepository.save(withdrawalRequest);
	        
	        return true;
	    } else {

	        withdrawalRequestRepository.delete(withdrawalRequest);
	        
	        return false;
	    }
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequests(int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
	
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findAll(pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequestsByCustomer(Long customerId, int page, int size,
			String sortBy, String direction) {
		Customer customer = customerRepository.findById(customerId)
	            .orElseThrow(() -> new UserException("Customer not found"));
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByCustomer(customer,pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequestsByAgent(Long agentId, int page, int size,
			String sortBy, String direction) {
		Agent agent = agentRepository.findById(agentId)
	            .orElseThrow(() -> new UserException("Agent not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByAgent(agent, pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllApprovedWithdrawalRequestsByCustomer(Long customerId, int page,
			int size, String sortBy, String direction) {
		Customer customer = customerRepository.findById(customerId)
	            .orElseThrow(() -> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByIsApprovedTrueAndCustomer(customer,pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllApprovedWithdrawalRequestsByAgent(Long agentId, int page,
			int size, String sortBy, String direction) {
		Agent agent = agentRepository.findById(agentId)
	            .orElseThrow(() -> new UserException("Agent not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByIsApprovedTrueAndAgent(agent, pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequestsByAgent(Long agentId, int page,
			int size, String sortBy, String direction) {
		Agent agent = agentRepository.findById(agentId)
	            .orElseThrow(() -> new UserException("Agent not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByIsWithdrawTrueAndAgent(agent, pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequestsByCustomer(Long customerId, int page,
			int size, String sortBy, String direction) {
		Customer customer = customerRepository.findById(customerId)
	            .orElseThrow(() -> new UserException("Customer not found"));
		
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByIsWithdrawTrueAndCustomer(customer,pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequests(int page, int size, String sortBy,
			String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
	    Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
	
	    Page<WithdrawalRequests> pages = withdrawalRequestRepository.findByIsWithdrawTrue(pageable);
	    List<WithdrawalRequests> allWithdrawalRequests = pages.getContent();
	    List<WithdrawalRequestsDTO> allWithdrawalRequestsDTO = dtoService.convertWithdrawalRequestsListEntityToDTO(allWithdrawalRequests);
	
	    return new PagedResponse<WithdrawalRequestsDTO>(allWithdrawalRequestsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	
	

}
