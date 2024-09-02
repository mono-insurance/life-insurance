package com.monocept.app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionsDTO {

	private Long transactionId;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Transaction date is mandatory")
    private LocalDate transactionDate;

    @NotBlank(message = "Status is mandatory")
    private String status;

    @NotNull(message = "Policy account ID is mandatory")
    private Long policyAccountId;
	
}
