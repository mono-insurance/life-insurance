package com.monocept.app.controller;

import com.monocept.app.dto.CustomerCreationDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.service.CustomerService;
import com.monocept.app.service.StorageService;
import com.monocept.app.service.StripeService;
import com.monocept.app.utils.PagedResponse;

import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.dto.StripeChargeDTO;
import com.monocept.app.dto.StripeTokenDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.entity.DocumentUploaded;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

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
    
    @Autowired
    private StripeService stripeService;


    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    
    @PostMapping("/card/token")
    @ResponseBody
    public StripeTokenDTO createCardToken(@RequestBody StripeTokenDTO model) {
    	
    	return stripeService.createCardToken(model);
       
    }
    
    
    @PostMapping("/charge")
    @ResponseBody
    public StripeChargeDTO charge(@RequestBody StripeChargeDTO model) {
    	
    	return stripeService.charge(model);
       
    }


    @PostMapping("/customer/registration")
    ResponseEntity<Long> customerRegistration(@RequestBody @Valid RegistrationDTO registrationDTO) {

        Long id = customerService.customerRegistration(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
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




    @Operation(summary = "By Customer: Make Policy Account when buy policy")
    @PostMapping("/policy-account")
    public ResponseEntity<PolicyAccountDTO> createPolicyAccount(@RequestBody @Valid PolicyAccountDTO policyAccountDTO) {

        PolicyAccountDTO policyAccount = customerService.createPolicyAccount(policyAccountDTO);

        return new ResponseEntity<PolicyAccountDTO>(policyAccount, HttpStatus.OK);

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
            @RequestParam(name = "sortBy", defaultValue = "policyAccountId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<PolicyAccountDTO> policyAccounts = customerService.getAllPolicyAccounts(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<PolicyAccountDTO>>(policyAccounts, HttpStatus.OK);

    }


    @Operation(summary = "By Admin,emp: Get All policyClaims by Customer")
    @GetMapping("/policy-claims-request/{cid}")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsRequest(
            @PathVariable("cid")Long customerId,
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsRequest(pageNo, size, sort, sortBy, sortDirection,customerId);
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
    
    
    @Operation(summary = "By Customer: Get the customer profile")
    @GetMapping("/customer/profile/{cid}")
    public ResponseEntity<CustomerCreationDTO> getCustomerFullProfile(@PathVariable("cid") Long customerId) {

    	CustomerCreationDTO customer = customerService.getCustomerFullProfile(customerId);
        return new ResponseEntity<CustomerCreationDTO>(customer, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Customer: Update customer")
    @PutMapping("")
    public ResponseEntity<CustomerCreationDTO> updateCustomer(@RequestBody @Valid CustomerCreationDTO customerDTO) {

    	CustomerCreationDTO customer = customerService.updateCustomer(customerDTO);
        return new ResponseEntity<CustomerCreationDTO>(customer, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Customer: Get All Documents")
    @GetMapping("/documents/{id}")
    public ResponseEntity<List<DocumentUploadedDTO>> getDocumentsOfCustomer(@PathVariable(name="id") Long customerId) {

    	List<DocumentUploadedDTO> documents = customerService.getDocumentsOfCustomer(customerId);
        return new ResponseEntity<List<DocumentUploadedDTO>>(documents, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Customer: Get All Documents")
    @GetMapping("/documents/approved/{id}")
    public ResponseEntity<List<DocumentUploadedDTO>> getApprovedDocumentsOfCustomer(@PathVariable(name="id") Long customerId) {

    	List<DocumentUploadedDTO> documents = customerService.getApprovedDocumentsOfCustomer(customerId);
        return new ResponseEntity<List<DocumentUploadedDTO>>(documents, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Customer: Add or Update Document")
    @PutMapping("/documents/add-or-update/{id}")
    public ResponseEntity<String> addOrUpdateDocumentsOfCustomer(@PathVariable(name="id") Long customerId, @RequestParam(name="documentType") String documentType, @RequestParam(name = "file") MultipartFile file) {

    	String str = customerService.addOrUpdateDocumentsOfCustomer(customerId, documentType, file);
        return new ResponseEntity<String>(str, HttpStatus.OK);
    }
}
