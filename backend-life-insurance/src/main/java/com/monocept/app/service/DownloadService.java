package com.monocept.app.service;

import java.io.ByteArrayInputStream;
import java.util.List;

import com.monocept.app.entity.Transactions;
import com.monocept.app.entity.WithdrawalRequests;

public interface DownloadService {

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
