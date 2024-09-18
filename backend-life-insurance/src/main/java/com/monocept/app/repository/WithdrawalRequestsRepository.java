package com.monocept.app.repository;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.WithdrawalRequests;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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

	Page<WithdrawalRequests> findAllByIsApprovedTrueAndAgent(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findAllByIsApprovedTrueAndCustomer(Customer customer, Pageable pageable);

	Page<WithdrawalRequests> findAllByCustomer(Customer customer, Pageable pageable);

	Page<WithdrawalRequests> findAllByAgent(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findAllByPolicyAccountIn(List<PolicyAccount> policyAccounts, Pageable pageable);

	@Modifying
	@Transactional
	@Query("UPDATE WithdrawalRequests w set w.isApproved=true where w.withdrawalRequestsId=:withdrawalId")
	void reviewAgentCommission(@Param("withdrawalId") Long withdrawalId);


	WithdrawalRequests findByPolicyAccountAndCustomer(PolicyAccount policyAccount, Customer customer);

	List<WithdrawalRequests> findByIsWithdrawTrue();
    Long countByIsApprovedTrue();
	@Query("SELECT COUNT(wr) FROM WithdrawalRequests wr WHERE wr.agent IS NOT NULL AND wr.customer IS NULL")
	long countByAgentMappedAndNotByCustomer();
	@Query("SELECT COUNT(wr) FROM WithdrawalRequests wr WHERE wr.agent IS NOT NULL AND wr.customer IS NULL and wr.isApproved=true")
	long countByAgentMappedAndNotByCustomerAndIsApprovedTrue();

	Page<WithdrawalRequests> findByAgentAndIsApprovedTrue(Agent agent, Pageable pageable);

	Page<WithdrawalRequests> findByAgentAndIsApprovedFalse(Agent agent, Pageable pageable);
}
