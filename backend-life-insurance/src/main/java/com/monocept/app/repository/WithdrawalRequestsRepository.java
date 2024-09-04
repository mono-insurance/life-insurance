package com.monocept.app.repository;

import com.monocept.app.entity.WithdrawalRequests;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawalRequestsRepository extends JpaRepository<WithdrawalRequests,Long> {
    Page<WithdrawalRequests> findAllByIsApprovedFalse(Pageable pageable);

    Page<WithdrawalRequests> findAllByIsApprovedTrue(Pageable pageable);
}
