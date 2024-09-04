package com.monocept.app.controller;

import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.service.CustomerService;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {
    @Autowired
    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/profile")
    ResponseEntity<CustomerDTO> getCustomerProfile() {
        CustomerDTO customerProfileResponseDTO = customerService.getCustomerProfile();
        return new ResponseEntity<>(customerProfileResponseDTO, HttpStatus.OK);
    }
    @GetMapping("/all-customers")
    ResponseEntity<PagedResponse<CustomerDTO>> getAllCustomers() {
        PagedResponse<CustomerDTO> customerDTOPagedResponse = customerService.getAllCustomers();
        return new ResponseEntity<>(customerDTOPagedResponse, HttpStatus.OK);
    }



    @PostMapping("/profile")
    ResponseEntity<CustomerDTO> updateCustomerProfile(@RequestBody @Valid CustomerDTO customerDTO) {
        CustomerDTO customerProfileResponseDTO = customerService.updateCustomerProfile(customerDTO);
        return new ResponseEntity<>(customerProfileResponseDTO, HttpStatus.OK);
    }





}
