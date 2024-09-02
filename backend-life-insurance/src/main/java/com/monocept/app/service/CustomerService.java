package com.monocept.app.service;

import com.monocept.app.dto.CustomerProfileDTO;
import com.monocept.app.dto.CustomerProfileResponseDTO;

public interface CustomerService {
    CustomerProfileResponseDTO getCustomerProfile();

    CustomerProfileResponseDTO updateCustomerProfile(CustomerProfileDTO customerProfileDTO);
}
