package com.monocept.app.repository;

import com.monocept.app.entity.Customer;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {
    Page<Customer> findAllByIsActiveTrue(Pageable pageable);

    Page<Customer> findAllByIsActiveFalse(Pageable pageable);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.isActive = false WHERE c.id = :customerId")
    int findByIdAndSetIsActiveFalse(@Param("customerId") Long customerId);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.isActive = true WHERE c.id = :customerId")
    int findByIdAndSetIsActiveTrue(@Param("customerId") Long customerId);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.isApproved = true WHERE c.id = :customerId")
    int findByIdAndSetIsApprovedTrue(@Param("customerId") Long customerId);
}
