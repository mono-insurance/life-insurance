package com.monocept.app.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    @Column(name ="user_id")
    private Long userId;
    
    @NotNull
	@Column(name ="is_withdraw")
	private Boolean isWithdraw;
	
    @NotNull
	@Column(name ="is_approved")
	private Boolean isApproved;

}
