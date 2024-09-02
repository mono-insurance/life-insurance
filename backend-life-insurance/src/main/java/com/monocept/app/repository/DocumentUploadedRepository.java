package com.monocept.app.repository;

import com.monocept.app.entity.DocumentUploaded;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentUploadedRepository extends JpaRepository<DocumentUploaded,Long> {
}
