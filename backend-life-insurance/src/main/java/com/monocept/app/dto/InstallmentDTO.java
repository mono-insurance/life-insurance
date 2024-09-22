package com.monocept.app.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InstallmentDTO {
	
	private Long transactionId;

	private Boolean lateCharges;

	private Double totalAmountPaid;
	
	private String transactionIdentification;
	

}
