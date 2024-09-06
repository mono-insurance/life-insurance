package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.EmailService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/suraksha/agent")
public class AgentController {
    private final AgentService agentService;
    private final EmailService emailService;

    public AgentController(AgentService agentService, EmailService emailService) {
        this.agentService = agentService;
        this.emailService = emailService;
    }
    
    
    
    // no testing done here
    
    
    
    
    @GetMapping("/profile/{aid}")
    ResponseEntity<AgentDTO> viewProfile(@PathVariable("aid")Long agentId) {
        AgentDTO agentDTO1 = agentService.viewProfile(agentId);
        return new ResponseEntity<>(agentDTO1, HttpStatus.OK);
    }

    @PostMapping("/update")
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
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "createdDate") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<PolicyAccountDTO> policyAccountDTOPagedResponse = agentService.
                getAllCustomerAccounts(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(policyAccountDTOPagedResponse, HttpStatus.OK);
    }
    @GetMapping("/customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllCustomers(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<CustomerDTO> customerDTOPagedResponse = agentService.
                getAllCustomers(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(customerDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/view-commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAgentCommission(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAgentCommission(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/withdrawal-commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getWithdrawalCommission(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getWithdrawalCommission(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }

    @GetMapping("/policy-claims")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllPolicyClaims(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "amount") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> withdrawalRequestsDTOPagedResponse = agentService.
                getAllPolicyClaims(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(withdrawalRequestsDTOPagedResponse, HttpStatus.OK);
    }
    
    
	  @Operation(summary = "By Admin,emp: Get agents")
	  @GetMapping("/agents")
	  ResponseEntity<PagedResponse<AgentDTO>> getAllAgents(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo, @RequestParam(name = "size", defaultValue = "10") int size, @RequestParam(name = "sort", defaultValue = "ASC") String sort, @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy, @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
	      PagedResponse<AgentDTO> allAgents = agentService.getAllAgents(pageNo, size, sort, sortBy, sortDirection);
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
