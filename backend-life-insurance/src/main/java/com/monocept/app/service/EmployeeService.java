package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;

import java.time.LocalDate;

public interface EmployeeService {
    EmployeeDTO getEmployeeProfile(Long empId);

    EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO);

    Boolean deleteCustomer(Long customerId);

    PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

    Boolean deleteAgent(Long agentId);

    Boolean activateAgent(Long agentId);

    Boolean activateCustomer(Long customerId);

    PagedResponse<CustomerDTO> getAllCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<CustomerDTO> getAllInActiveCustomers(int pageNo, int size, String sort, String sortBy, String sortDirection);
    QueryDTO updateQuery(Long id, QueryDTO queryDTO);
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


    PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsRequest(int pageNo, int size, String sort, String sortBy, String sortDirection);

    PagedResponse<WithdrawalRequestsDTO> getAllPolicyClaimsApproved(int pageNo, int size, String sort, String sortBy, String sortDirection);
}
