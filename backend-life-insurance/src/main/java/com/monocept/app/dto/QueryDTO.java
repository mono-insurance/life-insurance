package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QueryDTO {
	
	private Long queryId;

    @NotBlank(message = "Question is mandatory")
    private String question;

    @NotBlank(message = "Response is mandatory")
    private String response;

    @NotNull(message = "Approved Status is mandatory")
    private Boolean isResolved;

    @NotBlank(message = "Customer ID is mandatory")
    private Long customerId;

}
