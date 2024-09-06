package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeServiceImp implements EmployeeService{

    private final AccessConService accessConService;
    private final EmployeeRepository employeeRepository;
    private final DtoService dtoService;
    
    @Autowired
	private RoleRepository roleRepository;
    
    @Autowired
    private AuthRepository credentialsRepository;
    
    @Autowired
	private PasswordEncoder passwordEncoder;

    public EmployeeServiceImp(AccessConService accessConService, EmployeeRepository employeeRepository,
                              DtoService dtoService) {
        this.accessConService = accessConService;
        this.employeeRepository = employeeRepository;
        this.dtoService = dtoService;
    }
    
    
	@Override
	public EmployeeDTO createEmployee(EmployeeCreationDTO employeeDTO) {
		employeeDTO.setEmployeeId(0L);
		Employee employee = new Employee();
		
		employee.setEmployeeId(employeeDTO.getEmployeeId());
		employee.setFirstName(employeeDTO.getFirstName());
	    employee.setLastName(employeeDTO.getLastName());
	    employee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    employee.setQualification(employeeDTO.getQualification());
	    employee.setIsActive(true);
	    
	    Credentials credentials = new Credentials();
	    credentials.setUsername(employeeDTO.getUsername());
	    credentials.setEmail(employeeDTO.getEmail());
	    credentials.setPassword(passwordEncoder.encode(employeeDTO.getPassword()));
	    credentials.setMobileNumber(employeeDTO.getMobileNumber());
	    
	    Role role = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
    	credentials.setRole(role);
    	
    	employee.setCredentials(credentials);
    	credentials.setEmployee(employee);
    	credentials = credentialsRepository.save(credentials);

    	return dtoService.converEmployeeToEmployeeResponseDTO(credentials.getEmployee());
	}


	@Override
	public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
		Employee existingEmployee = employeeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Employee not found"));

		existingEmployee.setFirstName(employeeDTO.getFirstName());
	    existingEmployee.setLastName(employeeDTO.getLastName());
	    existingEmployee.setDateOfBirth(employeeDTO.getDateOfBirth());
	    existingEmployee.setQualification(employeeDTO.getQualification());
	    existingEmployee.setIsActive(employeeDTO.getIsActive());
	    existingEmployee.getCredentials().setUsername(employeeDTO.getCredentials().getUsername());
	    existingEmployee.getCredentials().setEmail(employeeDTO.getCredentials().getEmail());
	    existingEmployee.getCredentials().setMobileNumber(employeeDTO.getCredentials().getMobileNumber());

		Employee updatedEmployee = employeeRepository.save(existingEmployee);


		return dtoService.converEmployeeToEmployeeResponseDTO(updatedEmployee);
	}


	@Override
	public void deleteEmployee(Long id) {
		Employee existingEmployee = employeeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Employee not found"));
		
		if(!existingEmployee.getIsActive()) {
			throw new UserException("This Employee is already deleted");
		}
		
		existingEmployee.setIsActive(false);
		
		employeeRepository.save(existingEmployee);
	}

	
	
	
	@Override
	public PagedResponse<EmployeeDTO> getAllEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findAll(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	
	@Override
	public PagedResponse<EmployeeDTO> getAllActiveEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findByIsActiveTrue(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	
	
	@Override
	public PagedResponse<EmployeeDTO> getAllInactiveEmployees(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Employee> pages = employeeRepository.findByIsActiveFalse(pageable);
		List<Employee> allEmployees = pages.getContent();
		List<EmployeeDTO> allEmployeesDTO = dtoService.convertEmployeeListEntityToDTO(allEmployees);
		
		return new PagedResponse<EmployeeDTO>(allEmployeesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	


    @Override
    public EmployeeDTO getEmployeeProfile(Long empId) {
        accessConService.checkEmployeeServiceAccess(empId);
        Employee employee=findEmpById(empId);
        return dtoService.convertEmployeeToDTO(employee);
    }

    private Employee findEmpById(Long empId) {
        return employeeRepository.findById(empId).orElseThrow(()->new NoSuchElementException("employee not found"));
    }

    @Override
    public EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO) {
        accessConService.checkEmployeeServiceAccess(employeeDTO.getEmployeeId());
        Employee employee=findEmpById(employeeDTO.getEmployeeId());
        return dtoService.convertEmployeeToDTO(employee);
    }














}
