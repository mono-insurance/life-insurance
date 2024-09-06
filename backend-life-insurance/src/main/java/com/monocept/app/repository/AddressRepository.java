package com.monocept.app.repository;

import com.monocept.app.entity.Address;
import com.monocept.app.entity.Customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address,Long> {

	Optional<Address> findByCustomer(Customer customer);
}
