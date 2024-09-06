package com.monocept.app.repository;

import com.monocept.app.entity.InsuranceType;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceTypeRepository extends JpaRepository<InsuranceType,Long> {

	Page<InsuranceType> findByIsActiveTrue(Pageable pageable);

	Page<InsuranceType> findByIsActiveFalse(Pageable pageable);

	Optional<InsuranceType> findByTypeIdAndIsActiveTrue(Long id);
}
