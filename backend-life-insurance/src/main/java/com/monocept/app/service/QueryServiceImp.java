package com.monocept.app.service;

import java.util.ArrayList;
import java.util.List;

import com.monocept.app.dto.EmailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Query;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.QueryRepository;
import com.monocept.app.utils.PagedResponse;

@Service
public class QueryServiceImp implements QueryService{
	
	@Autowired
    private QueryRepository queryRepository;
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
    private CustomerRepository customerRepository;
	
	@Autowired
    private AccessConService accessConService;
	@Autowired
	private EmailService emailService;
	
	
	@Override
	public void deleteQuery(Long id) {
		accessConService.checkEmployeeAccess();
		Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));
		queryRepository.delete(existingQuery);
		
	}
	
	
    @Override
    public QueryDTO updateQuery(Long id, QueryDTO queryDTO) {
		accessConService.checkEmployeeAccess();
        Query existingQuery = queryRepository.findById(id)
                .orElseThrow(() -> new UserException("Query not found"));

        existingQuery.setQuestion(queryDTO.getQuestion());
        existingQuery.setResponse(queryDTO.getResponse());
        existingQuery.setIsResolved(true);

        Query updatedQuery = queryRepository.save(existingQuery);
		EmailDTO emailDTO = new EmailDTO();
		emailDTO.setEmailId(existingQuery.getCustomer().getCredentials().getEmail());
		emailDTO.setTitle("Query resolved");
		emailDTO.setBody("your query has been resolved by us.\n Please login to suraksha to see response from our side.");
		emailService.sendAccountCreationEmail(emailDTO);

        return dtoService.convertQueryToQueryDTO(updatedQuery);
    }
    @Override
    public PagedResponse<QueryDTO> getAllQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findAll(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }



    @Override
    public PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByIsResolvedTrue(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<QueryDTO> getAllUnresolvedQueries(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByIsResolvedFalse(pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public PagedResponse<QueryDTO> getAllQueriesByCustomer(int page, int size, String sortBy, String direction, Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByCustomer(customer, pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


	@Override
	public QueryDTO addQuery(QueryDTO queryDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    queryDTO.setQueryId(0L);
	    Query newQuery = dtoService.convertQueryDTOToEntity(queryDTO);
	    newQuery.setIsResolved(false);
	    newQuery.setCustomer(customer);
	    
	    Query savedQuery = queryRepository.save(newQuery);
		if(customer.getQueries()==null){
			List<Query> queries=new ArrayList<>();
			queries.add(savedQuery);
			customer.setQueries(queries);
		}
	    else customer.getQueries().add(savedQuery);
	    
	    return dtoService.convertQueryToQueryDTO(savedQuery);
	    
	}


	@Override
	public QueryDTO updateUnresolvedQueryByCustomer(Long id,QueryDTO queryDTO) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));

	    if (!existingQuery.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
	        throw new UserException("Unauthorized action: This query does not belong to the customer.");
	    }

	    if (existingQuery.getIsResolved()) {
	        throw new UserException("Query is already resolved and cannot be updated.");
	    }
	    
	    existingQuery.setQuestion(queryDTO.getQuestion());
	    
	    Query updatedQuery = queryRepository.save(existingQuery);

	    return dtoService.convertQueryToQueryDTO(updatedQuery);
	}


	@Override
	public void deleteUnresolvedQueryByCustomer(Long id) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));

	    if (!existingQuery.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
	        throw new UserException("Unauthorized action: This query does not belong to the customer.");
	    }

	    if (existingQuery.getIsResolved()) {
	        throw new UserException("Query is already resolved and cannot be deleted.");
	    }
	    
	    queryRepository.delete(existingQuery);
		
	}


	@Override
	public QueryDTO getQueryById(Long id) {
		Query existingQuery = queryRepository.findById(id)
	            .orElseThrow(() -> new UserException("Query not found"));
		
		return dtoService.convertQueryToQueryDTO(existingQuery);
	}


	@Override
	public PagedResponse<QueryDTO> getAllResolvedQueriesByCustomer(int page, int size, String sortBy, String direction,
			Long id) {
		
		Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByCustomerAndIsResolvedTrue(customer, pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public PagedResponse<QueryDTO> getAllUnresolvedQueriesByCustomer(int page, int size, String sortBy,
			String direction, Long id) {
		
		Customer customer = customerRepository.findById(id).orElseThrow(()-> new UserException("Customer not found"));

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<Query> pages = queryRepository.findByCustomerAndIsResolvedFalse(customer, pageable);
        List<Query> allQueries = pages.getContent();
        List<QueryDTO> allQueriesDTO = dtoService.convertQueryListEntityToDTO(allQueries);

        return new PagedResponse<QueryDTO>(allQueriesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

}
