package com.monocept.app.repository;

import com.monocept.app.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepository extends JpaRepository<City,Long> {
    Boolean existsByCityNameAndIsActiveTrue(String state);

    City findByCityName(String city);
}
