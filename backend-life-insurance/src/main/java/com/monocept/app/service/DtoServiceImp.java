package com.monocept.app.service;

import com.monocept.app.dto.AdminResponseDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Employee;
import org.springframework.stereotype.Service;

@Service
public class DtoServiceImp implements DtoService{
    @Override
    public AdminResponseDTO convertToAdminResponseDTO(Admin admin) {
        return new AdminResponseDTO(
                admin.getAdminId(),
                admin.getFirstName(),
                admin.getLastName(),
                convertToCredentialsDTO(admin.getCredentials())
        );
    }

    @Override
    public Employee convertEmployeeDtoToEmployee(EmployeeDTO employeeDTO) {
        Employee employee=new Employee();
        employee.setEmployeeId(2);
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setQualification(employeeDTO.getQualifications());
        employee.setDateOfBirth(employeeDTO.getDob());
        employee.setActive(true);
        return employee;
    }

    private CredentialsDTO convertToCredentialsDTO(Credentials credentials) {
        return new CredentialsDTO(
                credentials.getId(),
                credentials.getUsername(),
                credentials.getEmail(),
                credentials.getMobileNumber(),
                credentials.getRole().getName()
        );
    }
}
