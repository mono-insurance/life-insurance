package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class WithdrawalRequestsDTO {
	
	private Long withdrawalRequestsId;

    @NotBlank(message = "Request type is mandatory")
    private String requestType;

    private Double amount;

    private Boolean isWithdraw;

    private Boolean isApproved;

    private Long policyAccountId;
    

    private Long agentId;

    private Long customerId;
    
    
    private Long transactionId;
    
    
    
}
