package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	
	private Long id;
	
	@NotBlank(message = "Username is Mandatory")
	private String username;
	
	@NotBlank(message = "Email is Mandatory")
	private String email;
	
	
	@Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
	@NotBlank(message = "Mobile Number is Mandatory")
	private String mobileNumber;
	
	@NotBlank(message = "Role is Mandatory")
	private String role;
	
	@NotBlank(message = "First name is Mandatory")
	private String firstName;
	
	private String lastName;

}
