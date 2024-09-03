package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDTO {
	
	private Long adminId;
	
	@NotBlank(message = "First name is Mandatory")
	private String firstName;
	
	private String lastName;

	@NotNull(message = "Credentials are Mandatory")
    private CredentialsResponseDTO credentials;
}
