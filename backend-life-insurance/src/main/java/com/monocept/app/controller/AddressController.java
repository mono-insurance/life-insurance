package com.monocept.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.service.AddressService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha")
public class AddressController {
	
	@Autowired
    private AddressService addressService;

	@Operation(summary = "By Customer: Get the Address by customer")
    @GetMapping("/address/customer")
    public ResponseEntity<AddressDTO> getAddressByCustomerId() {
		
		AddressDTO address = addressService.findAddressByCustomerId();
				
        return new ResponseEntity<AddressDTO>(address,HttpStatus.OK);
    }

	
	@Operation(summary = "By Customer: Update customer address")
	@PutMapping("/address")
	public ResponseEntity<AddressDTO> updateCustomerAddress(@RequestBody @Valid AddressDTO addressDTO){
		
		AddressDTO address = addressService.updateCustomerAddress(addressDTO);
		return new ResponseEntity<AddressDTO>(address, HttpStatus.OK);
	}
}
