package com.monocept.app.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.CommissionDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.service.TransactionService;
import com.monocept.app.utils.BalancePagedResponse;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Operation(summary = "By All: Get All Transactions by Customer Policy Account")
    @GetMapping("/transactions/policy-account/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByPolicyAccount(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction,
            @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = transactionService.getAllTransactionsByPolicyAccount(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }



    @Operation(summary = "By All: Get All Transactions by Customer")
    @GetMapping("/transactions/customer/{id}")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<TransactionsDTO> transactions = transactionService.getAllTransactionsByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Get All the Transactions between Start date and End Date")
    @GetMapping("/transactions/date")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsBetweenDate(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @RequestParam(name = "startDate") LocalDate startDate, @RequestParam(name = "endDate") LocalDate endDate) {

        PagedResponse<TransactionsDTO> transactions = transactionService.getAllTransactionsBetweenDate(page, size, sortBy, direction, startDate, endDate);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }

    @Operation(summary = "By Admin and Employee: Get All the Transactions with status done")
    @GetMapping("")
    public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactions(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<TransactionsDTO> transactions = transactionService.getAllTransactions(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);

    }

    @Operation(summary = "By Admin,emp: Get All Commissions of all agents")
    @GetMapping("/commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllCommissions(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "withdrawalRequestsId") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allCommissions = transactionService.getAllCommissions(pageNo, size, sortBy, sortDirection);
        return new ResponseEntity<>(allCommissions, HttpStatus.OK);
    }
    
    
    
    @Operation(summary = "By Admin,emp: Get All Commissions of all agents")
    @GetMapping("/commissions/registration")
    ResponseEntity<BalancePagedResponse<CommissionDTO>> getAllRegistrationCommissionsByAgent(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "policyAccountId") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection) {
    	BalancePagedResponse<CommissionDTO> allCommissions = transactionService.getAllRegistrationCommissionsByAgent(pageNo, size, sortBy, sortDirection);
        return new ResponseEntity<>(allCommissions, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Admin,emp: Get All Commissions of all agents")
    @GetMapping("/commissions/installment")
    ResponseEntity<BalancePagedResponse<CommissionDTO>> getAllInstallmentCommissionsByAgent(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "desc") String sortDirection) {
    	BalancePagedResponse<CommissionDTO> allCommissions = transactionService.getAllInstallmentCommissionsByAgent(pageNo, size, sortBy, sortDirection);
        return new ResponseEntity<>(allCommissions, HttpStatus.OK);
    }

}
