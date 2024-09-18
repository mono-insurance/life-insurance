package com.monocept.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SystemCounts {
	
	private long totalActiveCustomers;
    private long totalInactiveCustomers;
    private long totalActiveAgents;
    private long totalInactiveAgents;
    private long totalActiveEmployees;
    private long totalInactiveEmployees;
    private long totalAdmins;
    private long totalCustomers;
    private long totalAgents;
    private long totalEmployees;

}
