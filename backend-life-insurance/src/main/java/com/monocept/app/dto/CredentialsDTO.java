package com.monocept.app.dto;

import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Employee;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CredentialsDTO {
	
	private Long id;
	
	@NotBlank(message = "Username is Mandatory")
	private String username;
	
	@NotBlank(message = "Email is Mandatory")
	private String email;
	
	@NotBlank(message = "Password is Mandatory")
	private String password;
	
	@Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
	@NotBlank(message = "Mobile Number is Mandatory")
	private String mobileNumber;
	
	@NotBlank(message = "Role is Mandatory")
	private String role;
	
	private CustomerDTO customerDTO;
	
	private AdminDTO adminDTO;
	
	private AgentDTO agentDTO;
	
	private EmployeeDTO employeeDTO;
	
}
