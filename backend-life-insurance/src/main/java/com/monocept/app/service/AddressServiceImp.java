package com.monocept.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.State;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AddressRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.StateRepository;

@Service
public class AddressServiceImp implements AddressService{
	
	@Autowired
    private AddressRepository addressRepository;
	
	@Autowired
    private CustomerRepository customerRepository;
	
	@Autowired
    private DtoService dtoService;
	
	@Autowired
    private StateRepository stateRepository;
	
	@Autowired
    private CityRepository cityRepository;
	
	@Autowired
    private AccessConService accessConService;

	@Override
	public AddressDTO findAddressByCustomerId() {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));

	    Address address = addressRepository.findByCustomer(customer)
	            .orElseThrow(() -> new UserException("Address not found for the given customer ID"));
	    
	    return dtoService.convertEntityToAddressDTO(address);
	}

	@Override
	public AddressDTO updateCustomerAddress(AddressDTO addressDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Customer customer = customerRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Customer not found"));
	    
	    if (!customer.getCustomerId().equals(addressDTO.getCustomerId())) {
	        throw new UserException("Unauthorized action: You can only update your own address.");
	    }
	    
	    Address currentAddress = customer.getAddress();
	    
	    currentAddress.setFirstStreet(addressDTO.getFirstStreet());
	    currentAddress.setLastStreet(addressDTO.getLastStreet());
	    currentAddress.setPincode(addressDTO.getPincode());
	    
	    if (!currentAddress.getState().getStateName().equals(addressDTO.getState())) {
	        State newState = stateRepository.findByStateName(addressDTO.getState())
	                .orElseThrow(() -> new UserException("State not found"));
	        currentAddress.setState(newState);
	    }

	    if (!currentAddress.getCity().getCityName().equals(addressDTO.getCity())) {
	        City newCity = cityRepository.findByCityName(addressDTO.getCity())
	                .orElseThrow(() -> new UserException("City not found"));
	        currentAddress.setCity(newCity);
	    }
	    
	    customerRepository.save(customer);

	    return dtoService.convertEntityToAddressDTO(currentAddress);
	}

}
