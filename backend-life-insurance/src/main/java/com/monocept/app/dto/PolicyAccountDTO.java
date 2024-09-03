package com.monocept.app.dto;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyAccountDTO {

	private Long policyAccountId;

    private LocalDate createdDate;

    @NotNull(message = "Matured date is mandatory")
    private LocalDate maturedDate;

    @NotNull(message = "Active status is mandatory")
    private Boolean isActive;

    @NotNull(message = "Policy term is mandatory")
    @Positive(message = "Policy term must be positive")
    private Integer policyTerm;

    @NotNull(message = "Payment time in months is mandatory")
    @Positive(message = "Payment time in months must be positive")
    private Integer paymentTimeInMonths;

    @NotNull(message = "Timely balance is mandatory")
    @Positive(message = "Timely balance must be positive")
    private Double timelyBalance;
    
    @NotNull(message = "Investment Amount is mandatory")
    @Positive(message = "Investment Amount must be positive")
    private Double investmentAmount;

    @NotNull(message = "Total amount paid is mandatory")
    @Positive(message = "Total amount paid must be positive")
    private Double totalAmountPaid;

    @NotNull(message = "Claim amount is mandatory")
    @Positive(message = "Claim amount must be positive")
    private Double claimAmount;

    @NotNull(message = "Policy ID is mandatory")
    private Long policyId;

    private Long customerId;

    private Long agentId;

}
