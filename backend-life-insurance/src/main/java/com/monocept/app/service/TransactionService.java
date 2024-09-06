package com.monocept.app.service;

import java.time.LocalDate;

import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.utils.PagedResponse;

public interface TransactionService {
    PagedResponse<WithdrawalRequestsDTO> getAllCommissions(int pageNo, int size, String sortBy, String sortDirection);

    Boolean reviewCommissionWithdrawalRequest(Long agentId, Boolean isApproved);

	PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
			String direction, Long id);

	PagedResponse<TransactionsDTO> getAllTransactionsByCustomer(int page, int size, String sortBy, String direction,
			Long id);

	PagedResponse<TransactionsDTO> getAllTransactionsBetweenDate(int page, int size, String sortBy, String direction,
			LocalDate startDate, LocalDate endDate);
}
