
package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.service.*;
import com.monocept.app.utils.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;


@RestController
@RequestMapping("/suraksha/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private AgentService agentService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private QueryService queryService;
    @Autowired
    private PolicyService policyService;

    @Autowired
    private StorageService storageService;

    @PostMapping(value = "/policy/{pid}/upload-policy-image", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    ResponseEntity<Boolean> addNewInsuranceImages(
            @PathVariable("pid") Long policyId,
            @RequestParam("file") MultipartFile file) {
        Boolean isAdded = storageService.addNewInsuranceImages(policyId, file);
        return new ResponseEntity<>(isAdded, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: update Policy")
    @PutMapping("/policy/{id}")
    public ResponseEntity<PolicyDTO> updatePolicy(@PathVariable(name = "id") Long id, @RequestBody @Valid PolicyDTO policyDTO) {

        PolicyDTO policy = policyService.updatePolicy(id, policyDTO);

        return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Create Employee")
    @PostMapping("/employee")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody @Valid EmployeeCreationDTO employeeDTO) {

        EmployeeDTO employee = employeeService.createEmployee(employeeDTO);

        return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Admin: Get Employee By Id")
    @GetMapping("/employee/{id}")
    public ResponseEntity<EmployeeCreationDTO> getEmployeeById(@PathVariable(name = "id") Long id) {

    	EmployeeCreationDTO employee = employeeService.getEmployeeById(id);

        return new ResponseEntity<EmployeeCreationDTO>(employee, HttpStatus.OK);
    }

    @Operation(summary = "By Admin and Employee: Update Employee")
    @PutMapping("/employee/{id}")
    public ResponseEntity<EmployeeCreationDTO> updateEmployee(@PathVariable(name = "id") Long id, @RequestBody @Valid EmployeeCreationDTO employeeDTO) {

    	EmployeeCreationDTO employee = employeeService.updateEmployee(id, employeeDTO);

        return new ResponseEntity<EmployeeCreationDTO>(employee, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Delete Employee")
    @DeleteMapping("/employee/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable(name = "id") Long id) {

        employeeService.deleteEmployee(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Get All Employee")
    @GetMapping("/employee")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Active Employee")
    @GetMapping("/employee/active")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllActiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllActiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Inactive Employee")
    @GetMapping("/employee/inactive")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllInactiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllInactiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Get employee profile")
    @GetMapping("/employee/profile/{eid}")
    ResponseEntity<EmployeeDTO> getEmployeeProfile(@PathVariable("eid") Long empId) {
        EmployeeDTO employeeDTO = employeeService.getEmployeeProfile(empId);
        return new ResponseEntity<>(employeeDTO, HttpStatus.OK);
    }


    @Operation(summary = "By Admin,emp: update emp profile")
    @PutMapping("/profile")
    ResponseEntity<EmployeeDTO> updateEmployeeProfile(@RequestBody @Valid EmployeeDTO employeeDTO) {
        EmployeeDTO updatedEmployeeDTO = employeeService.updateEmployeeProfile(employeeDTO);
        return new ResponseEntity<>(updatedEmployeeDTO, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: delete customer")
    @DeleteMapping("/customer/{cid}")
    ResponseEntity<Boolean> deleteCustomer(@PathVariable("cid") Long customerId) {
        Boolean isSuccess = customerService.deleteCustomer(customerId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: activate customer")
    @PostMapping("/activate-customer/{cid}")
    ResponseEntity<Boolean> activateCustomer(@PathVariable("cid") Long customerId) {
        Boolean isSuccess = customerService.activateCustomer(customerId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: approve customer")
    @PostMapping("/approve-customer/{cid}")
    ResponseEntity<Boolean> approveCustomerProfile(@PathVariable("cid") Long customerId
            , @RequestBody @Valid Boolean isApproved) {
        Boolean isSuccess = employeeService.approveCustomerProfile(customerId, isApproved);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: approve documents")
    @PostMapping("/approve-document/{did}")
    ResponseEntity<Boolean> approveDocument(@PathVariable("did") Long documentId
            , @RequestBody @Valid Boolean isApproved) {
        Boolean isSuccess = employeeService.approveDocument(documentId, isApproved);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }


    @Operation(summary = "By Admin,emp: Get agents")
    @GetMapping("/agents")
    ResponseEntity<PagedResponse<AgentDTO>> getAllAgents(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<AgentDTO> allAgents = agentService.getAllAgents(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allAgents, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: Get All active customers")
    @GetMapping("/customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllActiveCustomers(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerDTO> allCustomers = customerService.getAllCustomers(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allCustomers, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: Get All inactive customers")
    @GetMapping("/inactive-customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllInActiveCustomers(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerDTO> allCustomers = customerService.getAllInActiveCustomers(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allCustomers, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: delete agents")
    @DeleteMapping("/agent/{aid}")
    ResponseEntity<Boolean> deleteAgent(@PathVariable("aid") Long agentId) {
        Boolean isSuccess = agentService.deleteAgent(agentId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: activate agents")
    @PostMapping("/activate-agent/{aid}")
    ResponseEntity<Boolean> activateAgent(@PathVariable("aid") Long agentId) {
        Boolean isSuccess = agentService.activateAgent(agentId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,emp: review Commission Withdrawal Request")
    @GetMapping("/review-commissions/{wid}")
    ResponseEntity<Boolean> reviewCommissionWithdrawalRequest(
            @PathVariable("wid") Long withdrawalId,
            @RequestParam(value = "isApproved", defaultValue = "false")
            Boolean isApproved) {
        Boolean isSuccess = transactionService.reviewCommissionWithdrawalRequest(withdrawalId, isApproved);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Update Query")
    @PutMapping("/query/{id}")
    public ResponseEntity<QueryDTO> updateQuery(@PathVariable(name = "id") Long id, @RequestBody @Valid QueryDTO queryDTO) {

        QueryDTO query = queryService.updateQuery(id, queryDTO);

        return new ResponseEntity<>(query, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: Get All queries")
    @GetMapping("/queries")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllQueries(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = employeeService.getAllQueries(page, size, sortBy, direction);

        return new ResponseEntity<>(queries, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: update State")
    @PutMapping("/state/{id}")
    public ResponseEntity<StateDTO> updateState(@PathVariable(name = "id") Long id, @RequestBody @Valid StateDTO stateDTO) {

        StateDTO state = employeeService.updateState(id, stateDTO);

        return new ResponseEntity<>(state, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: update City")
    @PutMapping("/city/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable(name = "id") Long id, @RequestBody @Valid CityDTO cityDTO) {

        CityDTO city = employeeService.updateCity(id, cityDTO);

        return new ResponseEntity<>(city, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All States")
    @GetMapping("/state")
    public ResponseEntity<PagedResponse<StateDTO>> getAllStates(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<StateDTO> states = employeeService.getAllStates(page, size, sortBy, direction);

        return new ResponseEntity<>(states, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Cities")
    @GetMapping("/city")
    public ResponseEntity<PagedResponse<CityDTO>> getAllCities(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<CityDTO> cities = employeeService.getAllCities(page, size, sortBy, direction);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: Get All Insurance types")
    @GetMapping("/insurance/type")
    public ResponseEntity<PagedResponse<InsuranceTypeDTO>> getAllInsuranceTypes(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "typeId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<InsuranceTypeDTO> insuranceCategories = employeeService.getAllInsuranceTypes(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<InsuranceTypeDTO>>(insuranceCategories, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Resolved queries")
    @GetMapping("/queries/resolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllResolvedQueries(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = employeeService.getAllResolvedQueries(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: Get All Unresolved queries")
    @GetMapping("/queries/unresolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllUnresolvedQueries(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = employeeService.getAllUnresolvedQueries(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Queries By Customer")
    @GetMapping("/queries/customer/{id}")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllQueriesByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<QueryDTO> queries = employeeService.getAllQueriesByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Transactions")
    @GetMapping("/transactions")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactions(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactions(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Transactions by Customer Policy Account")
    @GetMapping("/transactions/policy-account/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByPolicyAccount(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsByPolicyAccount(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }

    @Operation(summary = "By Admin,emp: Get All policyClaims by Customer")
    @GetMapping("/policy-claims-request")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsRequest(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsRequest(pageNo, size, sort, sortBy, sortDirection, 0L);
        return new ResponseEntity<>(allPolicyClaims, HttpStatus.OK);
    }

    @Operation(summary = "By Admin,Emp: Get All PolicyClaims that are approved")
    @GetMapping("/policy-claims-approved")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsApproved(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsApproved(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allPolicyClaims, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Get All Transactions by Customer")
    @GetMapping("/transactions/customer/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All the Transactions between Start date and End Date")
    @GetMapping("/transactions/date")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsBetweenDate(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "id") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @RequestParam(name = "startDate") LocalDate startDate, @RequestParam(name = "endDate") LocalDate endDate) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsBetweenDate(page, size, sortBy, direction, startDate, endDate);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All feedback")
    @GetMapping("/feedback")
    public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacks(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<FeedbackDTO> feedbacks = employeeService.getAllFeedbacks(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<FeedbackDTO>>(feedbacks, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All feedbacks By Customer")
    @GetMapping("/feedback/customer/{id}")
    public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacksByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<FeedbackDTO> queries = employeeService.getAllFeedbacksByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<FeedbackDTO>>(queries, HttpStatus.OK);

    }

}
