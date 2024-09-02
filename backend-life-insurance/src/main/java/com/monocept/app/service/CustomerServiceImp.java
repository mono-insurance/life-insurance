package com.monocept.app.service;

import com.monocept.app.dto.CustomerProfileDTO;
import com.monocept.app.dto.CustomerProfileResponseDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.State;
import com.monocept.app.repository.AddressRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.StateRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImp implements CustomerService{

    private final CustomerRepository customerRepository;
    private final DtoService dtoService;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;
    private final AddressRepository addressRepository;

    public CustomerServiceImp(CustomerRepository customerRepository, DtoService dtoService,
                              StateRepository stateRepository, CityRepository cityRepository,
                              AddressRepository addressRepository) {
        this.customerRepository = customerRepository;
        this.dtoService = dtoService;
        this.stateRepository = stateRepository;
        this.cityRepository = cityRepository;
        this.addressRepository = addressRepository;
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

    @Override
    public Long customerRegisterRequest(CustomerProfileDTO customerProfileDTO) {
        Customer customer=dtoService.convertCustomerDtoToCustomer(customerProfileDTO);
        customer=customerRepository.save(customer);
        Address address=checkAndGetAddress(customerProfileDTO);
        customer.setAddress(address);
        customer=customerRepository.save(customer);
        return customer.getCustomerId();
    }

    private Address checkAndGetAddress(CustomerProfileDTO customerProfileDTO) {
        Address address=new Address();
        if(checkStateAndCity(customerProfileDTO)){
            State state=stateRepository.findByStateName(customerProfileDTO.getState());
            City city=cityRepository.findByCityName(customerProfileDTO.getCity());
            address.setCity(city);
            address.setState(state);
            address.setPincode(customerProfileDTO.getPinCode());
            address.setFirstStreet(customerProfileDTO.getFirstStreet());
            address.setLastStreet(customerProfileDTO.getLastStreet());
            return addressRepository.save(address);
        }
        return address;
    }

    private boolean checkStateAndCity(CustomerProfileDTO customerProfileDTO) {
        String state=customerProfileDTO.getState();
        Boolean isState= stateRepository.existsByStateNameAndIsActiveTrue(state);
        String city=customerProfileDTO.getCity();
        Boolean isCity= cityRepository.existsByCityNameAndIsActiveTrue(state);
        return isCity && isState;
    }
}
