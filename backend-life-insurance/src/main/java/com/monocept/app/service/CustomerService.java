package com.monocept.app.service;

import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;

public interface CustomerService {

    Long customerRegisterRequest(@Valid RegistrationDTO customerDTO);

    CustomerDTO getCustomerProfile();

    PagedResponse<CustomerDTO> getAllCustomers();

    CustomerDTO updateCustomerProfile(CustomerDTO customerDTO);
}
