package com.monocept.app.repository;

import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.utils.DocumentType;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentNeededRepository extends JpaRepository<DocumentNeeded,Long> {

	Optional<DocumentNeeded> findByDocumentType(DocumentType documentType);
}
