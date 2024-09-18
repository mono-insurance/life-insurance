package com.monocept.app.repository;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.DocumentUploaded;
import com.monocept.app.utils.DocumentType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    Page<DocumentUploaded> findAllByIsApprovedFalse(Pageable pageable);

    Page<DocumentUploaded> findAllByIsApprovedTrue(Pageable pageable);

    DocumentUploaded findByCustomerAndDocumentType(Customer customer, DocumentType documentType);

    DocumentUploaded findByAgentAndDocumentType(Agent agent, DocumentType documentType);
}
