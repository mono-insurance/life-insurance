package com.monocept.app.service;

import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.utils.PagedResponse;

public interface TransactionService {
    PagedResponse<WithdrawalRequestsDTO> getAllCommissions(int pageNo, int size, String sort, String sortBy, String sortDirection);

    Boolean reviewCommissionWithdrawalRequest(Boolean isApproved);
}
