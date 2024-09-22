package com.monocept.app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCreationDTO {
	
	private Long employeeId;

    @NotBlank(message = "First name is mandatory")
    private String firstName;

    private String lastName;

    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Qualification is mandatory")
    private String qualification;

    @NotBlank(message = "Username is mandatory")
    private String username;

    @NotBlank(message = "Email is mandatory")
    private String email;


    private String password;
    
    private Boolean isActive;

    @Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
    @NotBlank(message = "Mobile Number is mandatory")
    private String mobileNumber;

    @NotBlank(message = "Role is mandatory")
    private String role;

}
