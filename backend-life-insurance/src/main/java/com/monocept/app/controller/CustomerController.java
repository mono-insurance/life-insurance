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
@RequestMapping("/suraksha")
public class CustomerController {
	
    @Autowired
    private CustomerService customerService;
    
    @Autowired
    private StorageService storageService;
    
    
    
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    
    @PostMapping("/customer/registration")
    ResponseEntity<Long> customerRegistration(@RequestBody @Valid RegistrationDTO registrationDTO) {
    	
        Long id = customerService.customerRegistration(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Customer: Get the customer profile")
	@GetMapping("/customer")
	public ResponseEntity<CustomerDTO> getCustomerProfile(){
		
    	CustomerDTO customer = customerService.getCustomerProfile();
		return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
	}
	
	
	
	@Operation(summary = "By Customer: Update customer profile")
	@PutMapping("/customer")
	public ResponseEntity<CustomerDTO> updateCustomerProfile(@RequestBody @Valid CustomerDTO customerDTO){
		
		CustomerDTO customer = customerService.updateCustomerProfile(customerDTO);
		return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
	}
	
	
	// no testing from here
	
	
	
	@Operation(summary = "By Customer: Make Policy Account when buy policy")
	@PostMapping("/policy-account")
	public ResponseEntity<PolicyAccountDTO> createPolicyAccount(PolicyAccountDTO policyAccountDTO){
		
		PolicyAccountDTO policyAccount = customerService.createPolicyAccount(policyAccountDTO);
		
		return new ResponseEntity<PolicyAccountDTO>(policyAccount, HttpStatus.OK);
		
	}

	
	@Operation(summary = "By Customer: Payment to pay")
	@GetMapping("/policy-account/{id}/payment")
	public ResponseEntity<Double> paymentToPay(@PathVariable(name="id") Long id, @RequestParam LocalDate paymentToBeMade){
		
		Double payment = customerService.paymentToPay(id, paymentToBeMade);
		
		return new ResponseEntity<Double>(payment, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Customer: Get Customer Policy Account by Account Number")
	@GetMapping("/policy-accounts/{id}")
	public ResponseEntity<PagedResponse<PolicyAccountDTO>> getPolicyAccountsByAccountNumber(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<PolicyAccountDTO> policyAccounts = customerService.getPolicyAccountsByAccountNumber(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<PolicyAccountDTO>>(policyAccounts, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Customer: Get All Customer Policy Account")
	@GetMapping("/policy-accounts")
	public ResponseEntity<PagedResponse<PolicyAccountDTO>> getAllPolicyAccounts(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<PolicyAccountDTO> policyAccounts = customerService.getAllPolicyAccounts(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<PolicyAccountDTO>>(policyAccounts, HttpStatus.OK);
		
	}
	
	
	

	
	
	  @Operation(summary = "By Admin,emp: Get All policyClaims by Customer")
	  @GetMapping("/policy-claims-request")
	  ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaimsRequest(
	          @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
	          @RequestParam(name = "size", defaultValue = "10") int size,
	          @RequestParam(name = "sort", defaultValue = "ASC") String sort,
	          @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
	          @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
	      PagedResponse<WithdrawalRequestsDTO> allPolicyClaims = customerService.getAllPolicyClaimsRequest(pageNo, size, sort, sortBy, sortDirection);
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

	  
	  
    @PostMapping("/insurance/{iid}/upload-insurance-images")
    ResponseEntity<Boolean> addNewInsuranceImages(
            @PathVariable("iid") Long insuranceId,
            @RequestParam("file") MultipartFile file) {
        Boolean isAdded = storageService.addNewInsuranceImages(insuranceId, file);
        return new ResponseEntity<>(isAdded, HttpStatus.OK);
    }





	
}
