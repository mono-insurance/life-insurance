package com.monocept.app.repository;

import com.monocept.app.entity.State;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State,Long> {
    Boolean existsByStateNameAndIsActiveTrue(String state);

    Optional<State> findByStateName(String state);

	Page<State> findByIsActiveTrue(Pageable pageable);

	Page<State> findByIsActiveFalse(Pageable pageable);
}
