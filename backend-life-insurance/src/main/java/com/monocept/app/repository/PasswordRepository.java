package com.monocept.app.repository;

import com.monocept.app.entity.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordRepository extends JpaRepository<Password,Long> {
    Password findByOtp(String otp);
}
