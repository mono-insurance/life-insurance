package com.monocept.app.service;

import com.monocept.app.dto.CustomUserDetails;

public interface AccessConService {
	
    CustomUserDetails checkUserAccess();

    String getUserRole();

    void checkSameUserOrRole(Long agentId);

    void checkEmployeeServiceAccess(Long employeeId);

    void checkEmployeeAdminAccess(Long employeeId);

    void checkAdminAccess();

    void checkDocumentAccess(Long documentId);

    void checkDocumentDeleteAccess(Long documentId);

    void checkEmployeeAccess();

    void checkCustomerAccess(Long customerId);

    void checkPolicyAccountAccess(Long id);


    void checkAgentAccess(Long agentId);

}
