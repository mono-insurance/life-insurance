package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.CustomerService;
import com.monocept.app.service.EmailService;
import com.monocept.app.service.EmployeeService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/suraksha/agent")
public class AgentController {
    private final AgentService agentService;
    private final EmailService emailService;
    private final CustomerService customerService;
    private final EmployeeService employeeService;

    public AgentController(AgentService agentService, EmailService emailService,
                           CustomerService customerService, EmployeeService employeeService) {
        this.agentService = agentService;
        this.emailService = emailService;
        this.customerService = customerService;
        this.employeeService = employeeService;
    }
    @Operation(summary = "By Admin: Get All Transactions by Customer")
    @GetMapping("/transactions/customer/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }
    @Operation(summary = "By Admin: Get All Transactions by Customer Policy Account")
    @GetMapping("/transactions/policy-account/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByPolicyAccount(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsByPolicyAccount(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }
    @Operation(summary = "By Admin: Get All the Transactions between Start date and End Date")
    @GetMapping("/transactions/date")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsBetweenDate(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction,
            @RequestParam(name = "startDate") LocalDate startDate,
            @RequestParam(name = "endDate") LocalDate endDate) {

        PagedResponse<TransactionsDTO> transactions = employeeService.getAllTransactionsBetweenDate(page, size, sortBy, direction, startDate, endDate);
        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
    }

    @GetMapping("/balance")
    ResponseEntity<BalanceDTO> getAgentBalance() {
        BalanceDTO balanceDTO = agentService.getAgentBalance();
        return new ResponseEntity<>(balanceDTO, HttpStatus.OK);
    }
    
    @GetMapping("/profile/{aid}")
    ResponseEntity<AgentDTO> viewProfile(@PathVariable("aid")Long agentId) {
        AgentDTO agentDTO = agentService.viewProfile(agentId);
        return new ResponseEntity<>(agentDTO, HttpStatus.OK);
    }
    @GetMapping("/dashboard")
    ResponseEntity<DashBoardDTO> agentDashboard() {
        DashBoardDTO dashBoardDTO = agentService.agentDashboard();
        return new ResponseEntity<>(dashBoardDTO, HttpStatus.OK);
    }

    @PutMapping("/update")
    ResponseEntity<AgentDTO> updateAgent(@RequestBody @Valid AgentDTO agentDTO) {
        AgentDTO updatedAgent = agentService.updateAgent(agentDTO);
        return new ResponseEntity<>(updatedAgent, HttpStatus.OK);
    }
    @PostMapping("/commission-withdrawal-request")
    ResponseEntity<Boolean> withdrawalRequest(@RequestParam("agentCommission")Double agentCommission) {
        Boolean isSuccess = agentService.withdrawalRequest(agentCommission);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @PostMapping("/send-email")
    ResponseEntity<Boolean> sendEmails(@RequestBody @Valid EmailDTO emailDTO) {
        Boolean isSuccess = emailService.sendEmails(emailDTO);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }
    
    @GetMapping("/policy-accounts")
    ResponseEntity<PagedResponse<PolicyAccountDTO>> getAllCustomerAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "createdDate") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<PolicyAccountDTO> policyAccountDTOPagedResponse = agentService.
                getAllCustomerAccounts(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(policyAccountDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/policy-accounts/active")
    ResponseEntity<PagedResponse<PolicyAccountDTO>> getAllCustomerActiveAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "createdDate") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<PolicyAccountDTO> policyAccountDTOPagedResponse = agentService.
                getAllCustomerActiveAccounts(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(policyAccountDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/policy-accounts/inactive")
    ResponseEntity<PagedResponse<PolicyAccountDTO>> getAllCustomerInActiveAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "createdDate") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<PolicyAccountDTO> policyAccountDTOPagedResponse = agentService.
                getAllCustomerInActiveAccounts(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(policyAccountDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/approved-commissions/{aid}")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllApprovedCommissions(
            @PathVariable("aid")Long agentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAllApprovedCommissions(agentId,page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/not-approved-commissions/{aid}")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllNotApprovedCommissions(
            @PathVariable("aid")Long agentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAllNotApprovedCommissions(agentId,page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllCustomers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<CustomerDTO> customerDTOPagedResponse = agentService.
                getAllCustomers(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(customerDTOPagedResponse, HttpStatus.OK);
    }
    @Operation(summary = "By Admin,emp: Get All inactive customers")
    @GetMapping("/inactive-customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllInActiveCustomers(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerDTO> allCustomers = customerService.getAllInActiveCustomers(page, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allCustomers, HttpStatus.OK);
    }
    @Operation(summary = "By Admin,emp: Get All active customers")
    @GetMapping("/active-customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllActiveCustomers(
            @RequestParam(name = "page", defaultValue = "0")
            int page, @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerDTO> allCustomers = customerService.getAllActiveCustomers(page, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allCustomers, HttpStatus.OK);
    }
    @GetMapping("/transactions")
    ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactions(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "serialNo") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<TransactionsDTO> customerDTOPagedResponse = agentService.
                getAllTransactions(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(customerDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/view-commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAgentCommission(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAgentCommission(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/withdrawal-commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getWithdrawalCommission(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getWithdrawalCommission(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/policy-claims")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaims(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAllPolicyClaims(page,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }
    
    
	  @Operation(summary = "By Admin,emp: Get agents")
	  @GetMapping("/agents")
	  ResponseEntity<PagedResponse<AgentDTO>> getAllAgents(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
	      PagedResponse<AgentDTO> allAgents = agentService.getAllAgents(page, size, sort, sortBy, sortDirection);
	      return new ResponseEntity<>(allAgents, HttpStatus.OK);
	  }
    @Operation(summary = "By Admin,emp: Get agents")
    @GetMapping("/{agentId}")
    ResponseEntity<PagedResponse<AgentDTO>> getAgentById(@PathVariable("agentId")Long agentId,
                                                         @RequestParam(name = "page", defaultValue = "0") int page,
                                                         @RequestParam(name = "size", defaultValue = "10") int size,
                                                         @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                         @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
                                                         @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<AgentDTO> allAgents = agentService.getAgentById(agentId);
        return new ResponseEntity<>(allAgents, HttpStatus.OK);
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

	
}
