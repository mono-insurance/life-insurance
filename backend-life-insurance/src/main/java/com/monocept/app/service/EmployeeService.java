package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;

import java.time.LocalDate;

public interface EmployeeService {
    EmployeeDTO getEmployeeProfile(Long empId);

    EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO);

	EmployeeDTO createEmployee(EmployeeCreationDTO employeeDTO);

	EmployeeCreationDTO updateEmployee(Long id, EmployeeCreationDTO employeeDTO);

	void deleteEmployee(Long id);

	PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction);

	PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction);

    PagedResponse<QueryDTO> getAllQueries(int page, int size, String sortBy, String direction);
    StateDTO updateState(Long id, StateDTO stateDTO);
    CityDTO updateCity(Long id, CityDTO cityDTO);
    PagedResponse<StateDTO> getAllStates(int page, int size, String sortBy, String direction);

    PagedResponse<CityDTO> getAllCities(int page, int size, String sortBy, String direction);

    PagedResponse<InsuranceTypeDTO> getAllInsuranceTypes(int page, int size, String sortBy, String direction);


    PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction);

    PagedResponse<QueryDTO> getAllUnresolvedQueries(int page, int size, String sortBy, String direction);

    PagedResponse<QueryDTO> getAllQueriesByCustomer(int page, int size, String sortBy, String direction, Long id);

    PagedResponse<TransactionsDTO> getAllTransactions(int page, int size, String sortBy, String direction);

    PagedResponse<TransactionsDTO> getAllTransactionsByPolicyAccount(int page, int size, String sortBy,
                                                                     String direction, Long id);

    PagedResponse<TransactionsDTO> getAllTransactionsByCustomer(int page, int size, String sortBy, String direction,
                                                                Long id);

    PagedResponse<TransactionsDTO> getAllTransactionsBetweenDate(int page, int size, String sortBy, String direction,
                                                                 LocalDate startDate, LocalDate endDate);

    PagedResponse<FeedbackDTO> getAllFeedbacks(int page, int size, String sortBy, String direction);

    PagedResponse<FeedbackDTO> getAllFeedbacksByCustomer(int page, int size, String sortBy, String direction, Long id);

    Boolean approveCustomerProfile(Long customerId, Boolean isApproved);

    Boolean approveDocument(Long documentId, Boolean isApproved);
	PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction);

	EmployeeCreationDTO getEmployeeById(Long id);

    DashBoardDTO employeeDashboard();

    PagedResponse<CustomerDTO> getAllRegisteredCustomers(int page, int size, String sortBy, String direction);

    PagedResponse<DocumentUploadedDTO> getAllNotApprovedDocuments(int page, int size, String sortBy, String direction);

    PagedResponse<DocumentUploadedDTO> getAllApprovedDocuments(int page, int size, String sortBy, String direction);

    PagedResponse<DocumentUploadedDTO> getAllDocuments(int page, int size, String sortBy, String direction);

    PagedResponse<DocumentUploadedDTO> getDocumentById(Long documentId);

    Boolean deletePolicyAccount(Long policyAccount);

    Boolean activatePolicyAccount(Long policyAccountId);
}
