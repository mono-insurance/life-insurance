package com.monocept.app.service;

import com.monocept.app.dto.CustomerDTO;

public interface CustomerService {
//    CustomerProfileResponseDTO getCustomerProfile();
//
//    CustomerProfileResponseDTO updateCustomerProfile(CustomerDTO customerDTO);
//
//    CustomerProfileResponseDTO getAllCustomers();

    Long customerRegisterRequest(CustomerDTO customerDTO);
}
