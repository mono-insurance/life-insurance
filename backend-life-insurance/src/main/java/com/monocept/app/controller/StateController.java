package com.monocept.app.controller;

import java.util.List;

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

import com.monocept.app.dto.StateDTO;
import com.monocept.app.service.StateService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/suraksha/state")
public class StateController {
	
	@Autowired
	private StateService stateService;
	
	
	@Operation(summary = "By Admin and Employee: get State by id")
    @GetMapping("/{id}")
    public ResponseEntity<StateDTO> getStateById(@PathVariable(name = "id") Long id) {

        StateDTO state = stateService.getStateById(id);

        return new ResponseEntity<>(state, HttpStatus.OK);
    }

    
    @Operation(summary = "By Admin and Employee: update State")
    @PutMapping("/{id}")
    public ResponseEntity<StateDTO> updateState(@PathVariable(name = "id") Long id, @RequestBody @Valid StateDTO stateDTO) {

        StateDTO state = stateService.updateState(id, stateDTO);

        return new ResponseEntity<>(state, HttpStatus.OK);
    }
    
    @Operation(summary = "By Admin and Employee: Activate State")
    @PutMapping("/activate/{id}")
    public ResponseEntity<StateDTO> activateState(@PathVariable(name = "id") Long id) {

        StateDTO state = stateService.activateState(id);

        return new ResponseEntity<>(state, HttpStatus.OK);
    }
    
    

    
    
    @Operation(summary = "By All: Get All Activated States")
    @GetMapping("/activated")
    public ResponseEntity<PagedResponse<StateDTO>> getAllActivatedStates(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<StateDTO> states = stateService.getAllActivatedStates(page, size, sortBy, direction);

        return new ResponseEntity<>(states, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin and Employee: Get All Inactivated States")
    @GetMapping("/inactivated")
    public ResponseEntity<PagedResponse<StateDTO>> getAllInactivatedStates(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<StateDTO> states = stateService.getAllInactivatedStates(page, size, sortBy, direction);

        return new ResponseEntity<>(states, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin and Employee: Get List of All Active states")
    @GetMapping("/all/active")
    public ResponseEntity<List<StateDTO>> getListOfAllActiveStates() {

    	List<StateDTO> states = stateService.getListOfAllActiveStates();

        return new ResponseEntity<>(states, HttpStatus.OK);

    }

}
