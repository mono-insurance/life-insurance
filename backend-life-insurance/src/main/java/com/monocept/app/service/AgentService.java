package com.monocept.app.service;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;

public interface AgentService {
    Long agentRegisterRequest(CredentialsDTO registrationDTO);

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

	String agentRegistration(RegistrationDTO registrationDTO, MultipartFile file1, MultipartFile file2);
}
