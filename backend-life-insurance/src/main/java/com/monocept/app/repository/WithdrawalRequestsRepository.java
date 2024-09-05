package com.monocept.app.repository;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.WithdrawalRequests;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalRequestsRepository extends JpaRepository<WithdrawalRequests,Long> {
    Page<WithdrawalRequests> findAllByIsApprovedFalse(Pageable pageable);

    Page<WithdrawalRequests> findAllByIsApprovedTrue(Pageable pageable);

	boolean existsByPolicyAccountAndCustomer(PolicyAccount policyAccount, Customer customer);

	boolean existsByPolicyAccountAndRequestTypeAndAgent(PolicyAccount policyAccount, String requestType, Agent agent);

	boolean existsByPolicyAccountAndRequestTypeAndAgentAndTransactionId(PolicyAccount policyAccount, String requestType,
			Agent agent, Long transactionId);

	Page<WithdrawalRequests> findByCustomer(Customer customer, Pageable pageable);

	Page<WithdrawalRequests> findByAgent(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findByIsApprovedTrueAndCustomer(Customer customer, Pageable pageable);

	Page<WithdrawalRequests> findByIsApprovedTrueAndAgent(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findByIsWithdrawTrueAndAgent(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findByIsWithdrawTrueAndCustomer(Customer customer, Pageable pageable);

	Page<WithdrawalRequests> findByIsWithdrawTrue(Pageable pageable);
}
