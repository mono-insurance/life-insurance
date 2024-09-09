package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginDTO {
	
	@NotBlank(message = "Username or Email is Mandatory")
	private String usernameOrEmail;
	
	@NotBlank(message = "Password is Mandatory")
	private String password;
	
}
