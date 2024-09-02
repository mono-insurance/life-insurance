package com.monocept.app.service;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.entity.*;
import org.springframework.stereotype.Service;

@Service
public class DtoServiceImp implements DtoService{

	@Override
	public AdminDTO convertToAdminResponseDTO(Admin admin) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Customer convertCustomerDtoToCustomer(CustomerDTO customerDTO) {
		// TODO Auto-generated method stub
		return null;
	}
//    @Override
//    public AdminDTO convertToAdminResponseDTO(Admin admin) {
//        return new AdminDTO(
//                admin.getAdminId(),
//                admin.getFirstName(),
//                admin.getLastName(),
//                convertToCredentialsDTO(admin.getCredentials())
//        );
//    }
//
//    @Override
//    public Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
//        Employee employee=new Employee();
//        employee.setEmployeeId(2);
//        employee.setFirstName(employeeDTO.getFirstName());
//        employee.setLastName(employeeDTO.getLastName());
//        employee.setQualification(employeeDTO.getQualifications());
//        employee.setDateOfBirth(employeeDTO.getDob());
//        employee.setActive(true);
//        return employee;
//    }
//
//    @Override
//    public Customer convertCustomerDtoToCustomer(CustomerDTO customerDTO) {
//        Customer customer=new Customer();
//        customer.setFirstName(customerDTO.getFirstName());
//        customer.setLastName(customerDTO.getLastName());
//        customer.setApproved(false);
//        customer.setGender(customerDTO.getCustomerGender());
//        customer.setDateOfBirth(customerDTO.getCustomerDOB());
//        customer.setNomineeName(customerDTO.getCustomerNomineeName());
//        customer.setNomineeRelation(customerDTO.getNomineeRelation());
//        customer.setActive(false);
//        return customer;
//    }
//
//
//    private CredentialsDTO convertToCredentialsDTO(Credentials credentials) {
//        return new CredentialsDTO(
//                credentials.getId(),
//                credentials.getUsername(),
//                credentials.getEmail(),
//                credentials.getMobileNumber(),
//                credentials.getRole().getName()
//        );
//    }
}
