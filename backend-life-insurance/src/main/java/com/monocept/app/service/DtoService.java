package com.monocept.app.service;

import com.monocept.app.dto.AdminResponseDTO;
import com.monocept.app.dto.CustomerProfileDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Employee;

public interface DtoService {
    AdminResponseDTO convertToAdminResponseDTO(Admin admin);

    Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO);

    Customer convertCustomerDtoToCustomer(CustomerProfileDTO customerProfileDTO);

}
