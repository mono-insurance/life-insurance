package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;

public interface AgentService {
    Long agentRegisterRequest(RegistrationDTO registrationDTO);

    AgentDTO updateAgent(AgentDTO agentDTO);

    AgentDTO viewProfile(Long agentId);

    PagedResponse<PolicyAccountDTO> getAllCustomerAccounts(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAgentCommission(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getWithdrawalCommission(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaims(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

	PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

	Boolean deleteAgent(Long agentId);

	Boolean activateAgent(Long agentId);

	Boolean approveAgent(Long agentId);
}
