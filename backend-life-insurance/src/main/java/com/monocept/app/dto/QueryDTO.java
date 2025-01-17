package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryDTO {
	
	private Long queryId;

    @NotBlank(message = "Question is mandatory")
    private String question;

    private String response;

    @NotNull(message = "Approved Status is mandatory")
    private Boolean isResolved;

    @NotNull(message = "Customer ID is mandatory")
    private Long customerId;

}
