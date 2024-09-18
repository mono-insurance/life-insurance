package com.monocept.app.controller;

import com.monocept.app.dto.CustomerDTO;

import com.monocept.app.service.CustomerService;
import com.monocept.app.service.StorageService;
import com.monocept.app.utils.PagedResponse;

import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/suraksha/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private StorageService storageService;


    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }


    @Operation(summary = "By Customer: Get the customer profile")
    @GetMapping("/customer/{cid}")
    public ResponseEntity<CustomerDTO> getCustomerProfile(@PathVariable("cid") Long customerId) {

        CustomerDTO customer = customerService.getCustomerProfile(customerId);
        return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
    }


    @Operation(summary = "By Customer: Update customer profile")
    @PutMapping("/customer")
    public ResponseEntity<CustomerDTO> updateCustomerProfile(@RequestBody @Valid CustomerDTO customerDTO) {

        CustomerDTO customer = customerService.updateCustomerProfile(customerDTO);
        return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
    }


    // no testing from here


    @Operation(summary = "By Customer: Make Policy Account when buy policy")
    @PostMapping("/policy-account")
    public ResponseEntity<PolicyAccountDTO> createPolicyAccount(@RequestBody PolicyAccountDTO policyAccountDTO) {

        PolicyAccountDTO policyAccount = customerService.createPolicyAccount(policyAccountDTO);

        return new ResponseEntity<PolicyAccountDTO>(policyAccount, HttpStatus.OK);

    }


    @Operation(summary = "By Customer: Payment to pay")
    @GetMapping("/policy-account/{id}/payment")
    public ResponseEntity<Double> paymentToPay(@PathVariable(name = "id") Long id, @RequestParam LocalDate paymentToBeMade) {

        Double payment = customerService.paymentToPay(id, paymentToBeMade);

        return new ResponseEntity<Double>(payment, HttpStatus.OK);

    }


    @Operation(summary = "By Customer: Get Customer Policy Account by Account Number")
    @GetMapping("/policy-accounts/{id}")
    public ResponseEntity<PolicyAccountDTO> getPolicyAccountsByAccountNumber(
            @PathVariable(name = "id") Long id) {

        PolicyAccountDTO policyAccounts = customerService.getPolicyAccountByAccountNumber(id);

        return new ResponseEntity<>(policyAccounts, HttpStatus.OK);

    }


    @Operation(summary = "By Customer: Get All Customer Policy Account")
    @GetMapping("/policy-accounts")
    public ResponseEntity<PagedResponse<PolicyAccountDTO>> getAllPolicyAccounts(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<PolicyAccountDTO> policyAccounts = customerService.getAllPolicyAccounts(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<PolicyAccountDTO>>(policyAccounts, HttpStatus.OK);

    }


    @Operation(summary = "By Admin,emp: Get All policyClaims by Customer")
    @GetMapping("/policy-claims-request/{cid}")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsRequest(
            @PathVariable("cid") Long customerId,
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsRequest(pageNo, size, sort, sortBy, sortDirection, customerId);
        return new ResponseEntity<>(allPolicyClaims, HttpStatus.OK);
    }


    @Operation(summary = "By Admin,Emp: Get All PolicyClaims that are approved")
    @GetMapping("/policy-claims-approved")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsApproved(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsApproved(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(allPolicyClaims, HttpStatus.OK);
    }
}
