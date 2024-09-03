package com.monocept.app.repository;

import com.monocept.app.entity.Credentials;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Credentials,Long> {
	
	Optional<Credentials> findByUsername(String username);
    
    Optional<Credentials> findByUsernameOrEmail(String username, String email);
}
