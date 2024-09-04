package com.monocept.app.service;

import java.time.LocalDate;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;

public interface CustomerService {

	CustomerDTO getCustomerProfile();

	CustomerDTO updateCustomerProfile(CustomerDTO customerDTO);

	Long customerRegistrationRequest(@Valid RegistrationDTO registrationDTO);

	AddressDTO updateCustomerAddress(AddressDTO addressDTO);

	QueryDTO addQuery(QueryDTO queryDTO);

	PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction);

	FeedbackDTO addFeedback(FeedbackDTO feedbackDTO);

	PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
			String direction, Long id);

	PagedResponse<PolicyAccountDTO> getAllPolicyAccounts(int page, int size, String sortBy, String direction);

	PagedResponse<PolicyAccountDTO> getPolicyAccountsByAccountNumber(int page, int size, String sortBy,
			String direction, Long id);

	PolicyAccountDTO createPolicyAccount(PolicyAccountDTO policyAccountDTO);

	Double paymentToPay(Long id, LocalDate paymentToBeMade);

}
