
package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.service.EmployeeService;
import com.monocept.app.service.TransactionService;
import com.monocept.app.utils.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RestController
@RequestMapping("/suraksha")
public class EmployeeController {

	@Autowired
    private EmployeeService employeeService;

	
    @Operation(summary = "By Admin: Create Employee")
    @PostMapping("/employee")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody @Valid EmployeeCreationDTO employeeDTO) {

        EmployeeDTO employee = employeeService.createEmployee(employeeDTO);

        return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);

    }
    
	@Operation(summary = "By Admin and Employee: Update Employee")
	@PutMapping("/employee/{id}")
	public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable(name = "id") Long id, @RequestBody @Valid EmployeeDTO employeeDTO) {
	
	    EmployeeDTO employee = employeeService.updateEmployee(id, employeeDTO);
	
	    return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);
	
	}


	@Operation(summary = "By Admin: Delete Employee")
    @DeleteMapping("/employee/{id}")
	public ResponseEntity<String> deleteEmployee(@PathVariable(name = "id") Long id) {
	
        employeeService.deleteEmployee(id);
	
	    return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);
	}
    
    
    @Operation(summary = "By Admin: Get All Employee")
    @GetMapping("/employee")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Active Employee")
    @GetMapping("/employee/active")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllActiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllActiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Inactive Employee")
    @GetMapping("/employee/inactive")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllInactiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = employeeService.getAllInactiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }



    @Operation(summary = "By Admin and Employee: Get employee profile")
    @GetMapping("/employee/profile/{eid}")
    ResponseEntity<EmployeeDTO> getEmployeeProfile(@PathVariable("eid") Long empId) {
        EmployeeDTO employeeDTO = employeeService.getEmployeeProfile(empId);
        return new ResponseEntity<>(employeeDTO, HttpStatus.OK);
    }



}
