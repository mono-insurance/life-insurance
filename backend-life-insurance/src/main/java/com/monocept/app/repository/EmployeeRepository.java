package com.monocept.app.repository;

import com.monocept.app.entity.Employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {

	Page<Employee> findByIsActiveTrue(Pageable pageable);

	Page<Employee> findByIsActiveFalse(Pageable pageable);

}
