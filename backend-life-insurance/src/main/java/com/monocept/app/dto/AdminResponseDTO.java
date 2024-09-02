package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponseDTO {
	
	private long adminId;
	
	@NotBlank(message = "First name is Mandatory")
	private String firstName;
	
	private String lastName;

	@NotBlank(message = "Credentials are Mandatory")
    private CredentialsDTO credentials;
}
