package com.monocept.app.service;

import com.monocept.app.dto.AgentDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Employee;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.EmployeeRepository;
import com.monocept.app.utils.PagedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EmployeeServiceImp implements EmployeeService{

    private final AccessConService accessConService;
    private final EmployeeRepository employeeRepository;
    private final DtoService dtoService;
    private final CustomerRepository customerRepository;
    private final AgentRepository agentRepository;

    public EmployeeServiceImp(AccessConService accessConService, EmployeeRepository employeeRepository,
                              DtoService dtoService, CustomerRepository customerRepository, AgentRepository agentRepository) {
        this.accessConService = accessConService;
        this.employeeRepository = employeeRepository;
        this.dtoService = dtoService;
        this.customerRepository = customerRepository;
        this.agentRepository = agentRepository;
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


    @Override
    public Boolean deleteCustomer(Long customerId) {
        accessConService.checkEmployeeServiceAccess(customerId);
        Customer customer=findCustomerById(customerId);
        if(!customer.getIsActive()) throw new NoSuchElementException("customer is already deleted");
        customer.setIsActive(false);
        customerRepository.save(customer);
        return true;
    }

    private Customer findCustomerById(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(()->new NoSuchElementException("customer not found"));
    }

    @Override
    public PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Agent> agentPage = agentRepository.findAll(pageable);
        List<Agent> agents = agentPage.getContent();
        List<AgentDTO> agentDTOS=dtoService.convertAgentsToDto(agents);
        return new PagedResponse<>(agentDTOS, agentPage.getNumber(),
                agentPage.getSize(), agentPage.getTotalElements(), agentPage.getTotalPages(),
                agentPage.isLast());
    }

    @Override
    public Boolean deleteAgent(Long agentId) {
        
        return null;
    }
}
