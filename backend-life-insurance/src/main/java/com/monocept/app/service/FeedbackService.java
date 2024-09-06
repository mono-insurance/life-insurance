package com.monocept.app.service;

import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.utils.PagedResponse;

public interface FeedbackService {

	FeedbackDTO addFeedback(FeedbackDTO feedbackDTO);

	PagedResponse<FeedbackDTO> getAllFeedbacks(int page, int size, String sortBy, String direction);

	PagedResponse<FeedbackDTO> getAllFeedbacksByCustomer(int page, int size, String sortBy, String direction, Long id);

}
