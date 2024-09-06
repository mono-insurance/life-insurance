package com.monocept.app.repository;

import com.monocept.app.entity.DocumentUploaded;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentUploadedRepository extends JpaRepository<DocumentUploaded,Long> {

    @Transactional
    @Modifying
    @Query("UPDATE DocumentUploaded d SET d.isApproved = true WHERE d.id = :documentId")
    int findByIdAndSetIsApprovedTrue(@Param("documentId") Long documentId);
}
