package com.monocept.app.dto;

import java.time.LocalDate;

import com.monocept.app.utils.NomineeRelation;
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

    private LocalDate maturedDate;

    private Boolean isActive;

    @NotNull(message = "nomineeName is Required")
    private String nomineeName;
    @NotNull(message = "nominee relation is Required")
    private NomineeRelation nomineeRelation;

    @NotNull(message = "Policy term is mandatory")
    @Positive(message = "Policy term must be positive")
    private Integer policyTerm;

    @NotNull(message = "Payment time in months is mandatory")
    @Positive(message = "Payment time in months must be positive")
    private Integer paymentTimeInMonths;


    @NotNull(message = "Investment Amount is mandatory")
    @Positive(message = "Investment Amount must be positive")
    private Double investmentAmount;

    private Double totalAmountPaid;

    private Double timelyBalance;

    private Double claimAmount;

    @NotNull(message = "Policy ID is mandatory")
    private Long policyId;

    private Long customerId;

    private Long agentId;

}
