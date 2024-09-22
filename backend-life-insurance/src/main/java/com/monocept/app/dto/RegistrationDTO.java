package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationDTO {


    @NotBlank(message = "First name is mandatory")
    @Size(max = 50, message = "First name can be at most 50 characters long")
    private String firstName;

    private String lastName;

    @NotNull(message = "Date of birth is mandatory")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private String gender;
    
    private String qualification;

    @NotBlank(message = "Nominee name is mandatory")
    @Size(max = 50, message = "Nominee name can be at most 50 characters long")
    private String nomineeName;

    @NotNull(message = "Nominee relation is mandatory")
    private String nomineeRelation;

    // Address Details
    @NotBlank(message = "First street is mandatory")
    private String firstStreet;

    private String lastStreet;

    @NotBlank(message = "Pincode is mandatory")
    @Pattern(regexp = "\\d{6}", message = "Pincode must be exactly 6 digits")
    private String pincode;

    @NotNull(message = "State ID is mandatory")
    private Long stateId;

    @NotNull(message = "City ID is mandatory")
    private Long cityId;

    @NotBlank(message = "Username is mandatory")
    private String username;

    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
    @NotBlank(message = "Mobile Number is mandatory")
    private String mobileNumber;

    @NotBlank(message = "Role is mandatory")
    private String role;

}
