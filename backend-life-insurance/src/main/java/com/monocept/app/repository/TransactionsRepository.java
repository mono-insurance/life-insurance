package com.monocept.app.repository;

import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.entity.Transactions;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionsRepository extends JpaRepository<Transactions,Long> {

	Page<Transactions> findByPolicyAccount(PolicyAccount policyAccount, Pageable pageable);

	Page<Transactions> findByPolicyAccountIn(List<PolicyAccount> policyAccounts, Pageable pageable);

	Page<Transactions> findByTransactionDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

	List<Transactions> findByPolicyAccount(PolicyAccount policyAccount);

	Page<Transactions> findAllByPolicyAccount(PolicyAccount policyAccount, Pageable pageable);
}
