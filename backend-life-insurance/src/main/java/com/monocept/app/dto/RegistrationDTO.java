package com.monocept.app.dto;

import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

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


    @NotNull(message = "Gender is mandatory")
    private String gender;

    @NotBlank(message = "Nominee name is mandatory")
    @Size(max = 50, message = "Nominee name can be at most 50 characters long")
    private String nomineeName;


    @NotNull(message = "Nominee relation is mandatory")
    private String nomineeRelation;

    @NotNull(message = "Address is mandatory")
    private AddressDTO address;

    @NotNull(message = "Credentials are mandatory")
    private CredentialsResponseDTO credentials;


}