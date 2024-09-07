package com.monocept.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.service.TransactionService;
import com.monocept.app.service.WithdrawalRequestsService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/suraksha/withdrawal-request")
public class WithdrawalRequestsController {
	
	@Autowired
	private WithdrawalRequestsService withdrawalRequestsService;
	
	@Operation(summary = "By Customer: Create a withdrawal request")
    @PostMapping("/customer")
    public ResponseEntity<WithdrawalRequestsDTO> createWithdrawalRequestForCustomer(@RequestBody @Valid WithdrawalRequestsDTO withdrawalRequestDTO) {
		 
        WithdrawalRequestsDTO createdRequest = withdrawalRequestsService.createWithdrawalRequestForCustomer(withdrawalRequestDTO);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }
	
	@Operation(summary = "By Agent: Create a withdrawal request")
    @PostMapping("/agent")
    public ResponseEntity<WithdrawalRequestsDTO> createWithdrawalRequestForAgent(@RequestBody @Valid WithdrawalRequestsDTO withdrawalRequestDTO) {
		 
        WithdrawalRequestsDTO createdRequest = withdrawalRequestsService.createWithdrawalRequestForAgent(withdrawalRequestDTO);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }
  
	@Operation(summary = "By Admin: Approve or reject request")
    @PostMapping("/admin/{id}")
    public ResponseEntity<Boolean> approveOrRejectRequest(@PathVariable(name="id") Long withDrawalRequestId, @RequestBody Boolean isApproved) {
		 
       Boolean decision = withdrawalRequestsService.approveOrRejectRequest(withDrawalRequestId, isApproved);
        return new ResponseEntity<Boolean>(decision, HttpStatus.CREATED);
    }
	
	
	@Operation(summary = "By Admin: Get All Withdrawal Requests")
    @GetMapping
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawalRequests(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawalRequests(page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Customer: Get All Withdrawal Requests by Customer")
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawalRequestsByCustomer(
            @PathVariable(name = "customerId") Long customerId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawalRequestsByCustomer(customerId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Agent: Get All Withdrawal Requests by Agent")
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawalRequestsByAgent(
            @PathVariable(name = "agentId") Long agentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawalRequestsByAgent(agentId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Approved Withdrawal Requests by Customer")
    @GetMapping("/customer/{customerId}/approved")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllApprovedWithdrawalRequestsByCustomer(
            @PathVariable(name = "customerId") Long customerId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllApprovedWithdrawalRequestsByCustomer(customerId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Approved Withdrawal Requests by Agent")
    @GetMapping("/agent/{agentId}/approved")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllApprovedWithdrawalRequestsByAgent(
            @PathVariable(name = "agentId") Long agentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllApprovedWithdrawalRequestsByAgent(agentId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Withdraw Withdrawal Requests by Agent")
    @GetMapping("/agent/{agentId}/withdraw")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawWithdrawalRequestsByAgent(
            @PathVariable(name = "agentId") Long agentId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawWithdrawalRequestsByAgent(agentId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Customer: Get All Withdraw Withdrawal Requests by Customer")
    @GetMapping("/customer/{customerId}/withdraw")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawWithdrawalRequestsByCustomer(
            @PathVariable(name = "customerId") Long customerId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawWithdrawalRequestsByCustomer(customerId, page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Withdraw Withdrawal Requests")
    @GetMapping("/withdraw")
    public ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllWithdrawWithdrawalRequests(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "requestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<WithdrawalRequestsDTO> requests = withdrawalRequestsService.getAllWithdrawWithdrawalRequests(page, size, sortBy, direction);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
  

}
