package com.monocept.app.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.monocept.app.entity.DocumentNeeded;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyDTO {
	
	private Long policyId;

    @NotBlank(message = "Policy name is mandatory")
    private String policyName;

    @NotNull(message = "Commission for new registration is mandatory")
    @Min(value = 0, message = "Commission for new registration cannot be less than 0")
    @Max(value = 100, message = "Commission for new registration cannot be more than 100")
    private Float commissionNewRegistration;

    @NotNull(message = "Commission for installment is mandatory")
    @Min(value = 0, message = "Commission for installment cannot be less than 0")
    @Max(value = 100, message = "Commission for installment cannot be more than 100")
    private Float commissionInstallment;

    private Boolean isActive;

    @NotBlank(message = "Description is mandatory")
    private String description;

    @NotNull(message = "Minimum policy term is mandatory")
    @Positive(message = "Minimum policy term must be positive")
    private Integer minPolicyTerm;

    @NotNull(message = "Maximum policy term is mandatory")
    @Positive(message = "Maximum policy term must be positive")
    private Integer maxPolicyTerm;

    @NotNull(message = "Minimum age is mandatory")
    private Integer minAge;

    @NotNull(message = "Maximum age is mandatory")
    private Integer maxAge;

    @NotBlank(message = "Eligible gender is mandatory")
    private String eligibleGender;

    @NotNull(message = "Minimum investment amount is mandatory")
    @Positive(message = "Minimum investment amount must be positive")
    private Long minInvestmentAmount;

    @NotNull(message = "Maximum investment amount is mandatory")
    @Positive(message = "Maximum investment amount must be positive")
    private Long maxInvestmentAmount;

    @NotNull(message = "Profit ratio is mandatory")
    @Min(value = 0, message = "Profit ratio cannot be less than 0")
    @Max(value = 100, message = "Profit ratio cannot be more than 100")
    private Float profitRatio;

    private LocalDate createdDate = LocalDate.now();

    private List<PolicyAccountDTO> policyAccounts;

    private List<String> documentsNeeded;

    @NotNull(message = "Insurance type ID is mandatory")
    private Long insuranceTypeId;
}
