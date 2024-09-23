package com.monocept.app.repository;


import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Transactions;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionsRepository extends JpaRepository<Transactions,Long> {

	Page<Transactions> findByPolicyAccount(PolicyAccount policyAccount, Pageable pageable);

	Page<Transactions> findByPolicyAccountIn(List<PolicyAccount> policyAccounts, Pageable pageable);

	Page<Transactions> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

	List<Transactions> findByPolicyAccount(PolicyAccount policyAccount);

	Page<Transactions> findAllByPolicyAccount(PolicyAccount policyAccount, Pageable pageable);

	@Query("SELECT t FROM Transactions t WHERE t.status = :status AND t.agentCommission IS NOT NULL")
	Page<Transactions> findByStatusAndAgentNotNull(@Param("status")String status, Pageable pageable);

	@Query("SELECT t FROM Transactions t WHERE t.status = :status AND t.agentCommission IS NOT NULL")
	List<Transactions> findByStatusAndAgentNotNull(@Param("status")String status);

	Page<Transactions> findByStatus(String status, Pageable pageable);


	Page<Transactions> findAllByPolicyAccountIn(List<PolicyAccount> agentAccounts, Pageable pageable);

	@Query("SELECT t from Transactions t where t.status = ?1")
	Page<Transactions> findAllByStatus(Pageable pageable, String status);

	Page<Transactions> findAllByPolicyAccountInAndStatus(List<PolicyAccount> agentAccounts, Pageable pageable, String done);

	Page<Transactions> findAllByPolicyAccountAndStatus(PolicyAccount policyAccount, Pageable pageable, String done);

}
