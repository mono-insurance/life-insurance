package com.monocept.app.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.monocept.app.entity.*;

public interface DownloadService {

	ByteArrayInputStream transactionsLoad(int page, int size, String sortBy, String direction);

	ByteArrayInputStream policyAccountLoad(int page, int size, String sortBy, String direction, Boolean isActive);

	ByteArrayInputStream customerLoad(int page, int size, String sortBy, String direction, Boolean isActive);

	ByteArrayInputStream agentLoad(int page, int size, String sortBy, String direction, Boolean isActive);

	ByteArrayInputStream withdrawalLoad(int page, int size, String sortBy, String direction, Boolean isActive);

	List<Transactions> getAllTransactions(int page, int size, String sortBy, String direction);

	List<Transactions> getTransactionByAccountNumber(Long policyId, int page, int size, String sortBy, String direction, Boolean isActive);

	List<WithdrawalRequests> getWithdrawals(int page, int size, String sortBy, String direction, Boolean isActive);

	Transactions getTransaction(Long id, int page, int size, String sortBy, String direction);

	List<PolicyAccount> getPolicyAccountsInPDF(int page, int size, String sortBy, String direction, Boolean isActive);

	List<Customer> getAllCustomersInPdf( int page, int size, String sortBy, String direction, Boolean isActive);

	List<Agent> getAllAgentsInPdf(int page, int size, String sortBy, String direction, Boolean isActive);
	
	
	ByteArrayInputStream transactionsLoad();

	ByteArrayInputStream policyAccountLoad();

	ByteArrayInputStream customerLoad();

	ByteArrayInputStream agentLoad();

	ByteArrayInputStream withdrawalLoad();

	List<Transactions> getAllTransactions();

	List<Transactions> getTransactionByAccountNumber(Long policyId);

	List<WithdrawalRequests> getWithdrawals();

	Transactions getTransaction(Long id);
}
