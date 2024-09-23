package com.monocept.app.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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
@Table(name = "withdrawal_requests")
public class WithdrawalRequests {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="withdrawal_requests_id")
	private Long withdrawalRequestsId;
	
	
	@NotBlank
	@Column(name ="request_type")
	private String requestType;
	
	
    @NotNull
    @Positive
    @Column(name = "amount")
    private Double amount;
    
    @NotNull
	@Column(name ="is_withdraw")
	private Boolean isWithdraw;
	
    @NotNull
	@Column(name ="is_approved")
	private Boolean isApproved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_account_id")
    @JsonBackReference
    private PolicyAccount policyAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    @JsonBackReference
    private Agent agent;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private Customer customer;
    
    
    private Long transactionId;
}
