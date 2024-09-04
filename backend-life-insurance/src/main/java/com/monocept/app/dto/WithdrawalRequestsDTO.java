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

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "User ID is mandatory")
    private Long userId;

    @NotNull(message = "Withdraw Status is mandatory")
    private Boolean isWithdraw;

    @NotNull(message = "Approved Status is mandatory")
    private Boolean isApproved;


}
