package com.monocept.app.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgentDTO {
	
	private Long agentId;
    
    @NotBlank(message = "First name is mandatory")
    private String firstName;
    
    private String lastName;
    
    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "Qualification is mandatory")
    private String qualification;
    
    @NotNull(message = "Active Status is mandatory")
    private Boolean isActive;
    
    @NotNull(message = "Approved Status is mandatory")
    private Boolean isApproved;

    private Double balance;

    private Double withdrawalAmount;
    
    @NotNull(message = "Credentials are mandatory")
    private CredentialsResponseDTO credentials;
    
    @NotNull(message = "Address is mandatory")
    private AddressDTO address;
    
    private List<DocumentUploadedDTO> documents;
    
    private List<PolicyAccountDTO> policyAccounts;

}
