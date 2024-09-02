package com.monocept.app.repository;

import com.monocept.app.entity.Credentials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthRepository extends JpaRepository<Credentials,Long> {
    Credentials findByUsername(String username);

    Credentials findByUsernameOrEmail(String username,String email);
}
