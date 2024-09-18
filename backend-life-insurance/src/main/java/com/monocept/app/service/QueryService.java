package com.monocept.app.service;

import com.monocept.app.dto.QueryDTO;
import com.monocept.app.utils.PagedResponse;

import jakarta.validation.Valid;


public interface QueryService {

	QueryDTO addQuery(QueryDTO queryDTO);

	void deleteQuery(Long id);

	QueryDTO updateQuery(Long id, QueryDTO queryDTO);

	PagedResponse<QueryDTO> getAllQueries(int page, int size, String sortBy, String direction);

	PagedResponse<QueryDTO> getAllResolvedQueries(int page, int size, String sortBy, String direction);

	PagedResponse<QueryDTO> getAllUnresolvedQueries(int page, int size, String sortBy, String direction);

	PagedResponse<QueryDTO> getAllQueriesByCustomer(int page, int size, String sortBy, String direction, Long id);

	QueryDTO updateUnresolvedQueryByCustomer(Long id, QueryDTO queryDTO);

	void deleteUnresolvedQueryByCustomer(Long id);

	QueryDTO getQueryById(Long id);

	PagedResponse<QueryDTO> getAllResolvedQueriesByCustomer(int page, int size, String sortBy, String direction,
			Long id);

	PagedResponse<QueryDTO> getAllUnresolvedQueriesByCustomer(int page, int size, String sortBy, String direction,
			Long id);

}
