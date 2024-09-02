package com.monocept.app.repository;

import com.monocept.app.entity.DocumentNeeded;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentNeededRepository extends JpaRepository<DocumentNeeded,Long> {
}
