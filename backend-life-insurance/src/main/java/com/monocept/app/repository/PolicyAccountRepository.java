package com.monocept.app.repository;

import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyAccountRepository extends JpaRepository<PolicyAccount,Long> {

	List<PolicyAccount> findByCustomer(Customer customer);

	Page<PolicyAccount> findByCustomer(Customer customer, Pageable pageable);

	Page<PolicyAccount> findByCustomerAndPolicyAccountId(Customer customer, Long id, Pageable pageable);
}
