package com.monocept.app.repository;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyAccountRepository extends JpaRepository<PolicyAccount,Long> {

	List<PolicyAccount> findByCustomer(Customer customer);

	Page<PolicyAccount> findByCustomer(Customer customer, Pageable pageable);

	Page<PolicyAccount> findByCustomerAndPolicyAccountId(Customer customer, Long id, Pageable pageable);

    Page<PolicyAccount> findByAgent(Agent agent, Pageable pageable);

	Page<PolicyAccount> findByPolicyAccountId(Long id, Pageable pageable);

    Page<PolicyAccount> findAllByAgent(Pageable pageable,Agent agent);


    @Query("SELECT pa FROM PolicyAccount pa WHERE pa.agent IS NOT NULL")
	Page<PolicyAccount> findByAgentNotNull(Pageable pageable);

    @Query("SELECT pa FROM PolicyAccount pa WHERE pa.agent IS NOT NULL")
	List<PolicyAccount> findByAgentNotNull();

    Long countByIsActiveTrue();

    Page<PolicyAccount> findAllByIsActiveTrue(Pageable pageable);

    Page<PolicyAccount> findAllByIsActiveFalse(Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE PolicyAccount p set p.isActive=false where p.policyAccountId=:policyAccountId")
    int deletePolicyAccount(@Param("policyAccountId") Long policyAccount);
    @Modifying
    @Transactional
    @Query("UPDATE PolicyAccount p set p.isActive=true where p.policyAccountId=:policyAccountId")
    int activatePolicyAccount(Long policyAccountId);

    Page<PolicyAccount> findAllByCustomer(Pageable pageable, Customer customer);

    Page<PolicyAccount> findAllByAgentAndIsActiveTrue(Pageable pageable, Agent agent);

    Page<PolicyAccount> findAllByAgentAndIsActiveFalse(Pageable pageable, Agent agent);

    Page<PolicyAccount> findByCustomerAndIsActiveTrue(Pageable pageable, Customer customer);

    Page<PolicyAccount> findByCustomerAndIsActiveFalse(Pageable pageable, Customer customer);
}
