package com.monocept.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommissionDTO {
	
	private Long agentId;
	
	private String agentName;
	
	private Double amount;
	
	private Long policyAccountId;
	
	private Long serialNo;
	

}
