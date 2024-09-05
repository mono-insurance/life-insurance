package com.monocept.app.service;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.entity.Address;

import jakarta.validation.Valid;

public interface AddressService {

	AddressDTO updateCustomerAddress(AddressDTO addressDTO);

	AddressDTO findAddressByCustomerId();

}
