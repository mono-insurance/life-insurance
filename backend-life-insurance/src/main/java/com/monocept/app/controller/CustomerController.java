package com.monocept.app.controller;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.PolicyAccountDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.service.CustomerService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;
    
    
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    
    
    
    @Operation(summary = "By Customer: Get the customer profile")
	@GetMapping
	public ResponseEntity<CustomerDTO> getCustomerProfile(){
		
    	CustomerDTO customer = customerService.getCustomerProfile();
		return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
	}
	
	
	
	@Operation(summary = "By Customer: Update customer profile")
	@PutMapping
	public ResponseEntity<CustomerDTO> updateCustomerProfile(@RequestBody @Valid CustomerDTO customerDTO){
		
		CustomerDTO customer = customerService.updateCustomerProfile(customerDTO);
		return new ResponseEntity<CustomerDTO>(customer, HttpStatus.OK);
	}
	
	
	@Operation(summary = "By Customer: Update customer address")
	@PutMapping("/address")
	public ResponseEntity<AddressDTO> updateCustomerAddress(@RequestBody @Valid AddressDTO addressDTO){
		
		AddressDTO address = customerService.updateCustomerAddress(addressDTO);
		return new ResponseEntity<AddressDTO>(address, HttpStatus.OK);
	}
	

	@Operation(summary = "By Customer: Add Query")
	@PostMapping("/query")
	public ResponseEntity<QueryDTO> addQuery(@RequestBody @Valid QueryDTO queryDTO){
		
		QueryDTO query = customerService.addQuery(queryDTO);
		
		return new ResponseEntity<QueryDTO>(query, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Customer: Get All Resolved queries to customer")
	@GetMapping("/queries/resolved")
	public ResponseEntity<PagedResponse<QueryDTO>> getAllResolvedQueries(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<QueryDTO> queries = customerService.getAllResolvedQueries(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Customer: Add Feedback")
	@PostMapping("/feedback")
	public ResponseEntity<FeedbackDTO> addFeedback(@RequestBody @Valid FeedbackDTO feedbackDTO){
		
		FeedbackDTO feedback = customerService.addFeedback(feedbackDTO);
		
		return new ResponseEntity<FeedbackDTO>(feedback, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Customer: Get All Transactions by Customer Policy Account")
	@GetMapping("/transactions/policy-account/{id}")
	public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByPolicyAccount(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<TransactionsDTO> transactions = customerService.getAllTransactionsByPolicyAccount(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
		
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
	
}
