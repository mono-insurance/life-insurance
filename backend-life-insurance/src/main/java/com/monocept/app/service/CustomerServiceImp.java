package com.monocept.app.service;

import com.monocept.app.dto.CustomerProfileDTO;
import com.monocept.app.dto.CustomerProfileResponseDTO;
import com.monocept.app.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImp implements CustomerService{

    private final CustomerRepository customerRepository;

    public CustomerServiceImp(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerProfileResponseDTO getCustomerProfile() {
        return null;
    }

    @Override
    public CustomerProfileResponseDTO updateCustomerProfile(CustomerProfileDTO customerProfileDTO) {
        return null;
    }

    @Override
    public CustomerProfileResponseDTO getAllCustomers() {
        return null;
    }
}
