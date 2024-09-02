package com.monocept.app.service;

import com.monocept.app.dto.CustomerDTO;
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
	public Long customerRegisterRequest(CustomerDTO customerDTO) {
		// TODO Auto-generated method stub
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

//    @Override
//    public Long customerRegisterRequest(CustomerDTO customerDTO) {
//        Customer customer=dtoService.convertCustomerDtoToCustomer(customerDTO);
//        customer=customerRepository.save(customer);
//        Address address=checkAndGetAddress(customerDTO);
//        customer.setAddress(address);
//        customer=customerRepository.save(customer);
//        return customer.getCustomerId();
//    }
//
//    private Address checkAndGetAddress(CustomerDTO customerDTO) {
//        Address address=new Address();
//        if(checkStateAndCity(customerDTO)){
//            State state=stateRepository.findByStateName(customerDTO.getState());
//            City city=cityRepository.findByCityName(customerDTO.getCity());
//            address.setCity(city);
//            address.setState(state);
//            address.setPincode(customerDTO.getPinCode());
//            address.setFirstStreet(customerDTO.getFirstStreet());
//            address.setLastStreet(customerDTO.getLastStreet());
//            return addressRepository.save(address);
//        }
//        return address;
//    }
//
//    private boolean checkStateAndCity(CustomerDTO customerDTO) {
//        String state=customerDTO.getState();
//        Boolean isState= stateRepository.existsByStateNameAndIsActiveTrue(state);
//        String city=customerDTO.getCity();
//        Boolean isCity= cityRepository.existsByCityNameAndIsActiveTrue(state);
//        return isCity && isState;
//    }
}
