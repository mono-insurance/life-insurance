package com.monocept.app.controller;

import com.monocept.app.dto.CustomerProfileDTO;
import com.monocept.app.dto.CustomerProfileResponseDTO;
import com.monocept.app.service.CustomerService;
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
    ResponseEntity<CustomerProfileResponseDTO> getCustomerProfile() {
        CustomerProfileResponseDTO customerProfileResponseDTO = customerService.getCustomerProfile();
        return new ResponseEntity<>(customerProfileResponseDTO, HttpStatus.OK);
    }



    @PostMapping("/profile")
    ResponseEntity<CustomerProfileResponseDTO> updateCustomerProfile(@RequestBody @Valid CustomerProfileDTO customerProfileDTO) {
        CustomerProfileResponseDTO customerProfileResponseDTO = customerService.updateCustomerProfile(customerProfileDTO);
        return new ResponseEntity<>(customerProfileResponseDTO, HttpStatus.OK);
    }



}
