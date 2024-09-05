package com.monocept.app.service;

import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.PolicyAccountRepository;
import com.monocept.app.repository.TransactionsRepository;
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
public class TransactionServiceImp implements TransactionService{
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
	private TransactionsRepository transactionsRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
	private PolicyAccountRepository policyAccountRepository;
	
    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllCommissions(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        return null;
    }

	@Override
	public Boolean reviewCommissionWithdrawalRequest(Boolean isApproved) {
		// TODO Auto-generated method stub
		return null;
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


}
