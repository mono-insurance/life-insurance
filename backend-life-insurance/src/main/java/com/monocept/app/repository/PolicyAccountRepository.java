package com.monocept.app.repository;

import com.monocept.app.entity.PolicyAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyAccountRepository extends JpaRepository<PolicyAccount,Long> {
}
