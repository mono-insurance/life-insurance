package com.monocept.app.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.dto.*;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.utils.PagedResponse;

import jakarta.validation.Valid;

public interface CustomerService {

	CustomerDTO getCustomerProfile(Long customerId);

	CustomerDTO updateCustomerProfile(CustomerDTO customerDTO);

	Long customerRegistration(RegistrationDTO registrationDTO);

	PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction);


	PagedResponse<PolicyAccountDTO> getAllPolicyAccounts(int page, int size, String sortBy, String direction);

	PolicyAccountDTO getPolicyAccountByAccountNumber(Long id);

	PolicyAccountDTO createPolicyAccount(PolicyAccountDTO policyAccountDTO);

	PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsRequest(int pageNo, int size, String sort, String sortBy,
                                                                   String sortDirection, Long customerId);

	PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsApproved(int pageNo, int size, String sort, String sortBy,
			String sortDirection);

	Boolean deleteCustomer(Long customerId);

	Boolean activateCustomer(Long customerId);

	PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

	PagedResponse<CustomerDTO> getAllInActiveCustomers(int pageNo, int size, String sort, String sortBy,
			String sortDirection);

	CustomerCreationDTO getCustomerFullProfile(Long customerId);

	CustomerCreationDTO updateCustomer(CustomerCreationDTO customerDTO);

	PagedResponse<CustomerDTO> getAllActiveCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

	PagedResponse<CustomerDTO> getAllCustomersStartswith(int page, int size, String sort, String sortBy, String direction);

	CustomerCreationDTO getCustomerOnlyProfile();
	List<DocumentUploadedDTO> getDocumentsOfCustomer(Long customerId);

	String addOrUpdateDocumentsOfCustomer(Long customerId, String documentType, MultipartFile file);

	List<DocumentUploadedDTO> getApprovedDocumentsOfCustomer(Long customerId);

	void createInstallmentPayment(InstallmentDTO installmentDTO);

    DocumentUploadedDTO getDocumentById(Long documentId);
	PagedResponse<DocumentUploadedDTO> getAllDocuments(int page, int size, String sortBy, String direction);

	PagedResponse<DocumentUploadedDTO> getAllDisapprovedDocuments(int page, int size, String sortBy, String direction);

	PagedResponse<DocumentUploadedDTO> getAlDocumentsByAgent(Long id, int page, int size, String sortBy,
			String direction);

	PagedResponse<DocumentUploadedDTO> getAlDocumentsByCustomer(Long id, int page, int size, String sortBy,
			String direction);
}
