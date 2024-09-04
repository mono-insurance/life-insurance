package com.monocept.app.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Feedback;

public interface FeedbackRepository  extends JpaRepository<Feedback,Long> {

	Page<Feedback> findByCustomer(Customer customer, Pageable pageable);
}
