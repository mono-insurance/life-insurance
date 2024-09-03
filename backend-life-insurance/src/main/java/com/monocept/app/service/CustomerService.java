package com.monocept.app.service;

import java.time.LocalDate;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.utils.PagedResponse;

public interface CustomerService {

	CustomerDTO getCustomerProfile();

	CustomerDTO updateCustomerProfile(CustomerDTO customerDTO);

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
