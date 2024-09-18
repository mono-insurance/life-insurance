package com.monocept.app.repository;

import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QueryRepository extends JpaRepository<Query,Long> {

	Page<Query> findByIsResolvedTrue(Pageable pageable);

	Page<Query> findByIsResolvedFalse(Pageable pageable);

	Page<Query> findByCustomer(Customer customer, Pageable pageable);

    Page<Query> findByIsResolvedTrueAndCustomer(Pageable pageable, Customer customer);

	Page<Query> findByCustomerAndIsResolvedTrue(Customer customer, Pageable pageable);

	Page<Query> findByCustomerAndIsResolvedFalse(Customer customer, Pageable pageable);
}
