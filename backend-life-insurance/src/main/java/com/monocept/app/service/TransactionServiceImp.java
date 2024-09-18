package com.monocept.app.service;

import com.monocept.app.dto.CommissionDTO;
import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.EmailDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.entity.*;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.BalancePagedResponse;
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
public class TransactionServiceImp implements TransactionService {

    @Autowired
    private DtoService dtoService;

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PolicyAccountRepository policyAccountRepository;
    @Autowired
    private WithdrawalRequestsRepository withdrawalRequestsRepository;
    @Autowired
    private AccessConService accessConService;
    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private EmailService emailService;

    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllCommissions(
            int pageNo, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(pageNo, size, sort);
        CustomUserDetails customUserDetails = accessConService.checkUserAccess();
        String role = accessConService.getUserRole();
        Page<WithdrawalRequests> pages;
        if (role.equals("AGENT")) {
            Agent agent = agentRepository.findById(customUserDetails.getId()).
                    orElseThrow(() -> new UserException("agent not found"));
            pages = withdrawalRequestsRepository.findAllByAgent(agent, pageable);
        } else if (role.equals("EMPLOYEE") || role.equals("ADMIN") ) {
            pages = withdrawalRequestsRepository.findAll(pageable);
        }
        else{
            throw new RoleAccessException("you don't have access to this resource");
        }

        List<WithdrawalRequests> withdrawalRequests = pages.getContent();
        List<WithdrawalRequestsDTO> allTransactionsDTO = dtoService.convertWithdrawalsToDto(withdrawalRequests);

        return new PagedResponse<>(allTransactionsDTO, pages.getNumber(), pages.getSize(),
                pages.getTotalElements(), pages.getTotalPages(), pages.isLast());

    }


    @Override
    public Boolean reviewCommissionWithdrawalRequest(Long withdrawalId, Boolean isApproved) {
        accessConService.checkEmployeeAccess();
        WithdrawalRequests withdrawalRequests = withdrawalRequestsRepository.findById(withdrawalId).
                orElseThrow(() -> new UserException("withdrawal not found"));
        EmailDTO emailDTO = new EmailDTO();
        emailDTO.setEmailId(withdrawalRequests.getAgent().getCredentials().getEmail());
        if (isApproved) {
            withdrawalRequestsRepository.reviewAgentCommission(withdrawalId);

            emailDTO.setTitle("Withdrawal request accepted");
            emailDTO.setBody("Congrats!, your commission withdrawal request has been accepted.\n" +
                    " we have transferred requested money to your account\n");

        } else {
            emailDTO.setTitle("Withdrawal request rejected");
            emailDTO.setBody("Oops, your withdrawal request for your commission is rejected by us.\n" +
                    "please contact us or try again");
        }
        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }


    @Override
    public PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
                                                                            String direction, Long id) {
        accessConService.checkPolicyAccountAccess(id);
        PolicyAccount policyAccount = policyAccountRepository.findById(id)
                .orElseThrow(() -> new UserException("Policy account not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Transactions> pages = transactionsRepository.findByPolicyAccount(policyAccount, pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

        return new PagedResponse<>(allTransactionsDTO, pages.getNumber(), pages.getSize(),
                pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<TransactionsDTO> getAllTransactionsByCustomer(int page, int size, String sortBy,
                                                                       String direction, Long id) {
        String role = accessConService.getUserRole();
        if (role.equals("AGENT")) throw new RoleAccessException("agent don't have access to see this");
        CustomUserDetails customUserDetails = accessConService.checkUserAccess();
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        List<PolicyAccount> policyAccounts = policyAccountRepository.findByCustomer(customer);

        Page<Transactions> pages = transactionsRepository.findByPolicyAccountIn(policyAccounts, pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

        return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(),
                pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<TransactionsDTO> getAllTransactionsBetweenDate(int page, int size, String sortBy,
                                                                        String direction, LocalDate startDate, LocalDate endDate) {

        accessConService.checkEmployeeAccess();
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Transactions> pages = transactionsRepository.findByTransactionDateBetween(startDate, endDate, pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

        return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


	@Override
	public BalancePagedResponse<CommissionDTO> getAllRegistrationCommissionsByAgent(int page, int size, String sortBy,
			String sortDirection) {
		Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<PolicyAccount> pages = policyAccountRepository.findByAgentNotNull(pageable);
        List<PolicyAccount> allPolicyAccount = pages.getContent();
        List<CommissionDTO> allCommissionDTO = dtoService.convertPolicyAccountListEntityToCommissionDTO(allPolicyAccount);
        
        List<PolicyAccount> policyAccount = policyAccountRepository.findByAgentNotNull();
        
        if(policyAccount != null) {
        	double totalBalance = policyAccount.stream()
        		.mapToDouble(PolicyAccount::getAgentCommissionForRegistration)
        		.sum();
        	
        	return new BalancePagedResponse<CommissionDTO>(allCommissionDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast(), totalBalance);
        }
        else {
        	return new BalancePagedResponse<CommissionDTO>(allCommissionDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast(), 0.0);
        }
        
	}


	@Override
	public BalancePagedResponse<CommissionDTO> getAllInstallmentCommissionsByAgent(int page, int size, String sortBy,
			String sortDirection) {
		
		Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Transactions> pages = transactionsRepository.findByStatusAndAgentNotNull("Done", pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<CommissionDTO> allCommissionDTO = dtoService.convertTransactionListEntityToCommissionDTO(allTransactions);
        
        List<Transactions> transactions = transactionsRepository.findByStatusAndAgentNotNull("Done");
        
        if(transactions != null) {
	        double totalBalance = transactions.stream()
	        		.mapToDouble(Transactions::getAgentCommission)
	        		.sum();
	
	        return new BalancePagedResponse<CommissionDTO>(allCommissionDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast(), totalBalance);
        }
        else {
        	return new BalancePagedResponse<CommissionDTO>(allCommissionDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast(), 0.0);
        }
	}


	@Override
	public PagedResponse<TransactionsDTO> getAllTransactions(int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Transactions> pages = transactionsRepository.findByStatus("Done", pageable);
        List<Transactions> allTransactions = pages.getContent();
        List<TransactionsDTO> allTransactionsDTO = dtoService.convertTransactionListEntityToDTO(allTransactions);

        return new PagedResponse<TransactionsDTO>(allTransactionsDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

}
