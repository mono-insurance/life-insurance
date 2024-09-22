package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminCreationDTO {

	
	private Long adminId;
	
	@NotBlank(message = "First name is Mandatory")
	private String firstName;
	
	private String lastName;
	
    @NotBlank(message = "Username is mandatory")
    private String username;

    @NotBlank(message = "Email is mandatory")
    private String email;

    private String password;

    @Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
    @NotBlank(message = "Mobile Number is mandatory")
    private String mobileNumber;

    @NotBlank(message = "Role is mandatory")
    private String role;
}
