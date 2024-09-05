package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.utils.PagedResponse;

import jakarta.validation.Valid;

import java.time.LocalDate;

public interface EmployeeService {
    EmployeeDTO getEmployeeProfile(Long empId);

    EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO);

	EmployeeDTO createEmployee(EmployeeCreationDTO employeeDTO);

	EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);

	void deleteEmployee(Long id);

	PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction);

	PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction);

	PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction);
}
