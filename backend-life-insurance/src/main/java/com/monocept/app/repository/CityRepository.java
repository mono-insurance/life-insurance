package com.monocept.app.repository;

import com.monocept.app.entity.City;
import com.monocept.app.entity.State;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<City,Long> {
    Boolean existsByCityNameAndIsActiveTrue(String state);

    Optional<City> findByCityName(String city);

	Page<City> findByIsActiveTrue(Pageable pageable);

	Page<City> findByIsActiveFalse(Pageable pageable);

	Page<City> findByIsActiveTrueAndState(State state, Pageable pageable);
}
