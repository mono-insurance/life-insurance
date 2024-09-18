package com.monocept.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.StateDTO;
import com.monocept.app.service.QueryService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha/query")
public class QueryController {
	
	@Autowired
	private QueryService queryService;
	
	
	@Operation(summary = "By All: get Query by id")
    @GetMapping("/{id}")
    public ResponseEntity<QueryDTO> getQueryById(@PathVariable(name = "id") Long id) {

		QueryDTO query = queryService.getQueryById(id);

        return new ResponseEntity<>(query, HttpStatus.OK);
    }
	
	
	@Operation(summary = "By Customer: Add Query")
	@PostMapping("/query")
	public ResponseEntity<QueryDTO> addQuery(@RequestBody @Valid QueryDTO queryDTO){
		
		QueryDTO query = queryService.addQuery(queryDTO);
		
		return new ResponseEntity<QueryDTO>(query, HttpStatus.OK);
	}
	
	@Operation(summary = "By Customer: Update Unresolved Query By Customer")
	@PutMapping("/query/unresolved/{id}")
	public ResponseEntity<QueryDTO> updateUnresolvedQueryByCustomer(@PathVariable(name = "id") Long id,@RequestBody @Valid QueryDTO queryDTO){
		
		QueryDTO query = queryService.updateUnresolvedQueryByCustomer(id, queryDTO);
		
		return new ResponseEntity<QueryDTO>(query, HttpStatus.OK);
	}
	
	
	@Operation(summary = "By Customer: Delete Unresolved Query By Customer")
	@DeleteMapping("/query/unresolved/{id}")
	public ResponseEntity<String> deleteUnresolvedQueryByCustomer(@PathVariable(name = "id") Long id){
		
		queryService.deleteUnresolvedQueryByCustomer(id);
		
		return new ResponseEntity<String>("Deletd Successfully", HttpStatus.OK);
	}
	
    @Operation(summary = "By Admin and employee: Delete Query")
    @DeleteMapping("/query/{id}")
    public ResponseEntity<String> deleteQuery(@PathVariable(name = "id") Long id) {

    	queryService.deleteQuery(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin, employee and agent: Update Query")
    @PutMapping("/query/{id}")
    public ResponseEntity<QueryDTO> updateQuery(@PathVariable(name = "id") Long id, @RequestBody @Valid QueryDTO queryDTO) {

        QueryDTO query = queryService.updateQuery(id, queryDTO);

        return new ResponseEntity<>(query, HttpStatus.OK);

    }

    @Operation(summary = "By Admin, employee and agent: Get All queries")
    @GetMapping("/queries")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllQueries(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = queryService.getAllQueries(page, size, sortBy, direction);

        return new ResponseEntity<>(queries, HttpStatus.OK);

    }
    

    @Operation(summary = "By All: Get All Resolved queries")
    @GetMapping("/queries/resolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllResolvedQueries(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = queryService.getAllResolvedQueries(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }

    @Operation(summary = "By Admin, employee and agent: Get All Unresolved queries")
    @GetMapping("/queries/unresolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllUnresolvedQueries(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<QueryDTO> queries = queryService.getAllUnresolvedQueries(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }


    @Operation(summary = "By Admin, employee and agent: Get All Queries By Customer")
    @GetMapping("/queries/customer/{id}")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllQueriesByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<QueryDTO> queries = queryService.getAllQueriesByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }
    
    @Operation(summary = "By Customer: Get All Resolved Queries By Customer")
    @GetMapping("/queries/customer/{id}/resolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllResolvedQueriesByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<QueryDTO> queries = queryService.getAllResolvedQueriesByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }
    
    @Operation(summary = "By Customer: Get All Unresolved Queries By Customer")
    @GetMapping("/queries/customer/{id}/unresolved")
    public ResponseEntity<PagedResponse<QueryDTO>> getAllUnresolvedQueriesByCustomer(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<QueryDTO> queries = queryService.getAllUnresolvedQueriesByCustomer(page, size, sortBy, direction, id);

        return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);

    }

}
