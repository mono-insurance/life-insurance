package com.monocept.app.service;

import com.monocept.app.dto.AddressDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.City;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.State;
import com.monocept.app.repository.AddressRepository;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.PagedResponse;
import jakarta.validation.Valid;
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
	public Long customerRegisterRequest(@Valid RegistrationDTO registrationDTO) {
        Customer customer=dtoService.convertCustomerDtoToCustomer(registrationDTO);
        customer=customerRepository.save(customer);
        Address address=checkAndGetAddress(registrationDTO.getAddress());
        customer.setAddress(address);
        customer=customerRepository.save(customer);
        return customer.getCustomerId();
	}

    @Override
    public CustomerDTO getCustomerProfile() {
        return null;
    }

    @Override
    public PagedResponse<CustomerDTO> getAllCustomers() {
        return null;
    }

    @Override
    public CustomerDTO updateCustomerProfile(CustomerDTO customerDTO) {
        return null;
    }
//    @Override
//    public CustomerProfileResponseDTO getCustomerProfile() {
//        return null;
//    }
//
//    @Override
//    public CustomerProfileResponseDTO updateCustomerProfile(CustomerDTO customerDTO) {
//        return null;
//    }
//
//    @Override
//    public CustomerProfileResponseDTO getAllCustomers() {
//        return null;
//    }

    private Address checkAndGetAddress(AddressDTO addressDTO) {
        Address address=new Address();
        if(checkStateAndCity(addressDTO)){
            State state=stateRepository.findByStateName(addressDTO.getState());
            City city=cityRepository.findByCityName(addressDTO.getCity());
            address.setCity(city);
            address.setState(state);
            address.setPincode(addressDTO.getPincode());
            address.setFirstStreet(addressDTO.getFirstStreet());
            address.setLastStreet(addressDTO.getLastStreet());
            return addressRepository.save(address);
        }
        return address;
    }
    private boolean checkStateAndCity(AddressDTO addressDTO) {
        String state=addressDTO.getState();
        Boolean isState= stateRepository.existsByStateNameAndIsActiveTrue(state);
        String city=addressDTO.getCity();
        Boolean isCity= cityRepository.existsByCityNameAndIsActiveTrue(state);
        return isCity && isState;
    }
}
