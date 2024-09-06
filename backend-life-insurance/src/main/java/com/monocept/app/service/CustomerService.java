package com.monocept.app.service;

import java.time.LocalDate;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;

public interface CustomerService {

	CustomerDTO getCustomerProfile();

	CustomerDTO updateCustomerProfile(CustomerDTO customerDTO);

	Long customerRegistration(RegistrationDTO registrationDTO);

	PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction);

	PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
			String direction, Long id);

	PagedResponse<PolicyAccountDTO> getAllPolicyAccounts(int page, int size, String sortBy, String direction);

	PagedResponse<PolicyAccountDTO> getPolicyAccountsByAccountNumber(int page, int size, String sortBy,
			String direction, Long id);

	PolicyAccountDTO createPolicyAccount(PolicyAccountDTO policyAccountDTO);

	Double paymentToPay(Long id, LocalDate paymentToBeMade);

	PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsRequest(int pageNo, int size, String sort, String sortBy,
			String sortDirection);

	PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsApproved(int pageNo, int size, String sort, String sortBy,
			String sortDirection);

	Boolean deleteCustomer(Long customerId);

	Boolean activateCustomer(Long customerId);

	PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

	PagedResponse<CustomerDTO> getAllInActiveCustomers(int pageNo, int size, String sort, String sortBy,
			String sortDirection);

}
