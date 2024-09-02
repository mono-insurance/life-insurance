package com.monocept.app.service;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.entity.Address;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Employee;

public interface DtoService {
    AdminDTO convertToAdminResponseDTO(Admin admin);

    Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO);

    Customer convertCustomerDtoToCustomer(CustomerDTO customerDTO);

}
