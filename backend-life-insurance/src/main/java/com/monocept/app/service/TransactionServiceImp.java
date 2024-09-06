package com.monocept.app.service;

import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.utils.PagedResponse;
import org.springframework.stereotype.Service;

@Service
public class TransactionServiceImp implements TransactionService{
    @Override
    public PagedResponse<WithdrawalRequestsDTO> getAllCommissions(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        return null;
    }

    @Override
    public Boolean reviewCommissionWithdrawalRequest(Boolean isApproved) {
        return null;
    }
}
