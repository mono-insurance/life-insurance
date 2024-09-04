package com.monocept.app.service;

import com.monocept.app.dto.AgentDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.utils.PagedResponse;

public interface EmployeeService {
    EmployeeDTO getEmployeeProfile(Long empId);

    EmployeeDTO updateEmployeeProfile(EmployeeDTO employeeDTO);

    Boolean deleteCustomer(Long customerId);

    PagedResponse<AgentDTO> getAllAgents(int pageNo, int size, String sort, String sortBy, String sortDirection);

    Boolean deleteAgent(Long agentId);
}
