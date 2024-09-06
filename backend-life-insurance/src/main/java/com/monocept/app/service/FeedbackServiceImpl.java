package com.monocept.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Feedback;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.FeedbackRepository;
import com.monocept.app.utils.PagedResponse;

@Service
public class FeedbackServiceImpl implements FeedbackService{
	
	@Autowired
    private FeedbackRepository feedbackRepository;
	
	@Autowired
	private CustomerRepository customerRepository;
	
	@Autowired
    private AccessConService accessConService;
	
	@Autowired
	private DtoService dtoService;
	
	@Override
	public FeedbackDTO addFeedback(FeedbackDTO feedbackDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    feedbackDTO.setFeedbackId(0L);
	    Feedback newFeedback = dtoService.convertFeedbackDTOToEntity(feedbackDTO);
	    newFeedback.setCustomer(customer);
	    
	    Feedback savedFeedback = feedbackRepository.save(newFeedback);
	    customer.getFeedbacks().add(savedFeedback);
	    
	    return dtoService.convertFeedbackToFeedbackDTO(savedFeedback);
	    
	}
	
	
    @Override
    public PagedResponse<FeedbackDTO> getAllFeedbacks(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Feedback> pages = feedbackRepository.findAll(pageable);
        List<Feedback> allFeedbacks = pages.getContent();
        List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);

        return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<FeedbackDTO> getAllFeedbacksByCustomer(int page, int size, String sortBy, String direction,
                                                                Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Feedback> pages = feedbackRepository.findByCustomer(customer, pageable);
        List<Feedback> allFeedbacks = pages.getContent();
        List<FeedbackDTO> allFeedbacksDTO = dtoService.convertFeedbackListEntityToDTO(allFeedbacks);

        return new PagedResponse<FeedbackDTO>(allFeedbacksDTO, pages.getNumber(),
                pages.getSize(), pages.getTotalElements(), pages.getTotalPages(),
                pages.isLast());
    }

}
