package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;

public interface AgentService {
    Long agentRegisterRequest( RegistrationDTO registrationDTO);

    AgentDTO updateAgent(AgentDTO agentDTO);

    AgentDTO viewProfile(Long agentId);

    PagedResponse<PolicyAccountDTO> getAllCustomerAccounts(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAgentCommission(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getWithdrawalCommission(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaims(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

    Boolean withdrawalRequest(Double agentCommission);
	PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

	Boolean deleteAgent(Long agentId);

	Boolean activateAgent(Long agentId);

	Boolean approveAgent(Long agentId, Boolean isApproved);

    DashBoardDTO agentDashboard();

    Boolean inActivateAgent(Long agentId);

    PagedResponse<AgentDTO> getAllActiveAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<AgentDTO> getAllInActiveAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAllApprovedCommissions(Long agentId,int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAllNotApprovedCommissions(Long agentId, int pageNo, int size, String sort, String sortBy, String sortDirection);

    BalanceDTO getAgentBalance();

    PagedResponse<TransactionsDTO> getAllTransactions(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<AgentDTO> getAgentById(Long agentId);

    PagedResponse<PolicyAccountDTO> getAllCustomerActiveAccounts(int page, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<PolicyAccountDTO> getAllCustomerInActiveAccounts(int page, int size, String sort, String sortBy, String sortDirection);
}
