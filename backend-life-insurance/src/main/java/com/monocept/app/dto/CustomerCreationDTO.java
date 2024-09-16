package com.monocept.app.dto;

import java.time.LocalDate;

import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerCreationDTO {
	
	private Long customerId;

    @NotBlank(message = "First name is mandatory")
    @Size(max = 50, message = "First name can be at most 50 characters long")
    private String firstName;

    private String lastName;

    
    @NotNull(message = "Date of birth is mandatory")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    
    @NotNull(message = "Gender is mandatory")
    private GenderType gender;


    @NotNull(message = "Active status is mandatory")
    private Boolean isActive;


    @NotBlank(message = "Nominee name is mandatory")
    @Size(max = 50, message = "Nominee name can be at most 50 characters long")
    private String nomineeName;

    
    @NotNull(message = "Nominee relation is mandatory")
    private NomineeRelation nomineeRelation;

    
    @NotNull(message = "Approval status is mandatory")
    private Boolean isApproved;

    private String firstStreet;

    private String lastStreet;

    private String pincode;
    
    private String state;

    private String city;


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
