package com.monocept.app.repository;

import com.monocept.app.entity.Policy;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyRepository extends JpaRepository<Policy,Long> {

	Page<Policy> findByIsActiveTrue(Pageable pageable);

	Page<Policy> findByIsActiveFalse(Pageable pageable);
}
