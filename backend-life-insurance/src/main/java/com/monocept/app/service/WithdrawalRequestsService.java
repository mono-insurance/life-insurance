package com.monocept.app.service;

import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.utils.PagedResponse;

import jakarta.validation.Valid;

public interface WithdrawalRequestsService {

	WithdrawalRequestsDTO createWithdrawalRequestForCustomer(WithdrawalRequestsDTO withdrawalRequestDTO);

	WithdrawalRequestsDTO createWithdrawalRequestForAgent(WithdrawalRequestsDTO withdrawalRequestDTO);

	Boolean approveOrRejectRequest(Long withDrawalRequestId, Boolean isApproved);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequests(int page, int size, String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequestsByCustomer(Long customerId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawalRequestsByAgent(Long agentId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllApprovedWithdrawalRequestsByCustomer(Long customerId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllApprovedWithdrawalRequestsByAgent(Long agentId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequestsByAgent(Long agentId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequestsByCustomer(Long customerId, int page, int size,
			String sortBy, String direction);

	PagedResponse<WithdrawalRequestsDTO> getAllWithdrawWithdrawalRequests(int page, int size, String sortBy,
			String direction);

}
