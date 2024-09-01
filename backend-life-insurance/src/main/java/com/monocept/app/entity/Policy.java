package com.monocept.app.entity;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "policy")
public class Policy {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="policy_id")
	private long policyId;
	
	@NotBlank
	@Column(name ="policy_name")
	private String policyName;
	
	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private DocumentUploaded documentUploaded;
	
	@NotNull
    @Min(0)
    @Max(100)
    @Column(name = "commission_new_registration")
    private float commissionNewRegistration;
    
    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "commission_installment")
    private float commissionInstallment;
    
    
	@Column(name ="is_active")
	private boolean isActive;
	
	
	@NotBlank
	@Column(name ="description", columnDefinition = "TEXT")
	private String description;
	
	@NotNull
    @Positive
    @Column(name = "min_policy_term")
    private int minPolicyTerm;
    
    @NotNull
    @Positive
    @Column(name = "max_policy_term")
    private int maxPolicyTerm;
    
    
	@NotNull
    @Column(name = "min_age")
    private int minAge;

    @NotNull
    @Column(name = "max_age")
    private int maxAge;
    
    
	@NotBlank
	@Column(name ="eligible_gender")
    private String eligibleGender;
	
	@NotNull
    @Positive
    @Column(name = "min_investment_amount")
    private long minInvestmentAmount;
    
    @NotNull
    @Positive
    @Column(name = "max_investment_amount")
    private long maxInvestmentAmount;
    
    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "profit_ratio")
    private float profitRatio;
	
	
	@Column(name = "created_date")
	private LocalDate createdDate = LocalDate.now();
	

	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "policy_documents",
            joinColumns = @JoinColumn(name = "policy_id"),
            inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    private Set<DocumentNeeded> documentsNeeded;
	
	@ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "type_id")
    @JsonBackReference
    private InsuranceType insuranceType;

}
