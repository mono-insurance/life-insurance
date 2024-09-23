package com.monocept.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashBoardDTO {
    private long policyAccounts;
    private long activePolicyAccounts;
    private long inActivePolicyAccounts;
    private long withdrawals;
    private long approvedWithdrawals;
    private long notApprovedWithdrawals;
    private long agents;
    private long activeAgents;
    private long inactiveAgents;
    private long allCommissions;
    private long approvedCommissions;
    private long notApprovedCommissions;
    private long customers;
    private long activeCustomers;
    private long inactiveCustomers;
    private long notApprovedCustomers;

    public DashBoardDTO(long policyAccounts, long activePolicyAccounts, long inActivePolicyAccounts,
                        long withdrawals, long approvedWithdrawals, long notApprovedWithdrawals) {
        this.policyAccounts = policyAccounts;
        this.activePolicyAccounts = activePolicyAccounts;
        this.inActivePolicyAccounts = inActivePolicyAccounts;
        this.withdrawals = withdrawals;
        this.approvedWithdrawals = approvedWithdrawals;
        this.notApprovedWithdrawals = notApprovedWithdrawals;
    }
}
