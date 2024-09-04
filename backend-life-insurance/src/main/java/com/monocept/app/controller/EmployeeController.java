package com.monocept.app.controller;

import com.monocept.app.dto.AgentDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.WithdrawalRequestsDTO;
import com.monocept.app.service.EmployeeService;
import com.monocept.app.service.TransactionService;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final TransactionService transactionService;

    public EmployeeController(EmployeeService employeeService, TransactionService transactionService) {
        this.employeeService = employeeService;
        this.transactionService = transactionService;
    }

    @GetMapping("/profile/{eid}")
    ResponseEntity<EmployeeDTO> getEmployeeProfile(@PathVariable("eid")Long empId) {
        EmployeeDTO employeeDTO = employeeService.getEmployeeProfile(empId);
        return new ResponseEntity<>(employeeDTO, HttpStatus.OK);
    }

    @PostMapping("/profile")
    ResponseEntity<EmployeeDTO> updateEmployeeProfile(@RequestBody @Valid EmployeeDTO employeeDTO) {
        EmployeeDTO updatedEmployeeDTO = employeeService.updateEmployeeProfile(employeeDTO);
        return new ResponseEntity<>(updatedEmployeeDTO, HttpStatus.OK);
    }



    @DeleteMapping("/customer/{cid}")
    ResponseEntity<Boolean> deleteCustomer(@PathVariable("cid")Long customerId) {
        Boolean isSuccess = employeeService.deleteCustomer(customerId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @GetMapping("/agents")
    ResponseEntity<PagedResponse<AgentDTO>> getAllAgents(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<AgentDTO> isSuccess = employeeService.getAllAgents(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @GetMapping("/commissions")
    ResponseEntity<PagedResponse<WithdrawalRequestsDTO>> getAllCommissions(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection
    ) {
        PagedResponse<WithdrawalRequestsDTO> allCommissions =
                transactionService.getAllCommissions(pageNo,size,sort,sortBy,sortDirection);
        return new ResponseEntity<>(allCommissions, HttpStatus.OK);
    }

    @DeleteMapping("/agent/{aid}")
    ResponseEntity<Boolean> deleteAgent(@PathVariable("aid")Long agentId) {
        Boolean isSuccess = employeeService.deleteAgent(agentId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

}
