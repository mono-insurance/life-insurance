package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.utils.PageResult;

import java.util.List;
import java.util.Set;

public interface DtoService {
    AdminDTO convertToAdminResponseDTO(Admin admin);

    Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO);

    Customer convertCustomerDtoToCustomer(RegistrationDTO registrationDTO);

    Agent convertAgentDtoToAgent(AgentDTO agentDTO);

    AgentDTO convertAgentToAgentDto(Agent agent);
    AddressDTO convertAddressToDto(Address address);

    Address convertDtoToAddress(AddressDTO addressDTO);

    void updateCityAndState(Address agentAddress, AddressDTO address);

    Credentials convertCredentialResponseDtoToCredentials(Credentials credentials, CredentialsResponseDTO credentials1);

    PageResult convertToPage(List<PolicyAccount> policyAccountList, int pageNo, String sort, String sortBy, String sortDirection, int size);

    List<PolicyAccountDTO> convertPolicyAccountsToDto(List<PolicyAccount> policyAccounts);

    PageResult convertWithdrawalsToPage(List<WithdrawalRequests> withdrawalRequests, int pageNo, String sort, String sortBy, String sortDirection, int size);

    List<WithdrawalRequestsDTO> convertWithdrawalsToDto(List<WithdrawalRequests>  content);

    PageResult convertCustomersToPage(List<Customer> customerList, int pageNo, String sort, String sortBy, String sortDirection, int size);


    List<CustomerDTO> convertCustomersToDto(List<Customer> content);

    EmployeeDTO convertEmployeeToDTO(Employee employee);

    List<AgentDTO> convertAgentsToDto(List<Agent> agents);
}
