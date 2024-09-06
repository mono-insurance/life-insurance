package com.monocept.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.service.FeedbackService;
import com.monocept.app.service.QueryService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha/feedback")
public class FeedbackController {
	
	@Autowired
	private FeedbackService feedbackService;
	
	
	
	@Operation(summary = "By Customer: Add Feedback")
	@PostMapping("/feedback")
	public ResponseEntity<FeedbackDTO> addFeedback(@RequestBody @Valid FeedbackDTO feedbackDTO){
		
		FeedbackDTO feedback = feedbackService.addFeedback(feedbackDTO);
		
		return new ResponseEntity<FeedbackDTO>(feedback, HttpStatus.OK);

	}
	
    @Operation(summary = "By Admin and Employee: Get All feedback")
    @GetMapping("/feedback")
    public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacks(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<FeedbackDTO> feedbacks = feedbackService.getAllFeedbacks(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<FeedbackDTO>>(feedbacks, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Get All feedbacks By Customer")
    @GetMapping("/feedback/customer/{id}")
    public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacksByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<FeedbackDTO> queries = feedbackService.getAllFeedbacksByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<FeedbackDTO>>(queries, HttpStatus.OK);

    }

}
