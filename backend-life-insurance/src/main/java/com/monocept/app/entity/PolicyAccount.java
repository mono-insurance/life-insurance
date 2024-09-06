package com.monocept.app.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "policy_account")
public class PolicyAccount {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_account_id")
    private Long policyAccountId;

	@Column(name = "created_date")
	private LocalDate createdDate = LocalDate.now();

	@NotNull
	@Column(name = "matured_date")
	private LocalDate maturedDate;
	
	@NotNull
	@Column(name ="is_active")
	private Boolean isActive;
	
	
    @NotNull
    @Positive
    @Column(name = "policy_term")
    private Integer policyTerm;
    
    @NotNull
    @Positive
    @Column(name = "payment_time_in_months")
    private Integer paymentTimeInMonths;
    
    @NotNull
    @Positive
    @Column(name = "timely_balance")
    private Double timelyBalance;
    
    @NotNull
    @Positive
    @Column(name = "investment_amount")
    private Double investmentAmount;
    
    
    @NotNull
    @Positive
    @Column(name = "total_amount_paid")
    private Double totalAmountPaid;
    
    
    @NotNull
    @Positive
    @Column(name = "claim_amount")
    private Double claimAmount;
    
    @Column(name = "agent_commission")
    private Double agentCommissionForRegistration;
    
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    @JsonBackReference
    private Policy policy;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    @JsonBackReference
    private Agent agent;
    
    
    @OneToMany(mappedBy = "policyAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Transactions> transactions;

    @OneToMany(mappedBy = "policyAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<WithdrawalRequests> withdrawalRequests;

    

}
