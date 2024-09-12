package com.monocept.app.service;

import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.PolicyAccount;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AgentRepository;
import com.monocept.app.repository.CustomerRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class AccessConServiceImp implements AccessConService{

    private final AgentRepository agentRepository;
    private final CustomerRepository customerRepository;

    public AccessConServiceImp(AgentRepository agentRepository, CustomerRepository customerRepository) {
        this.agentRepository = agentRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomUserDetails checkUserAccess() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private boolean isCustomer(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_CUSTOMER"));
    }
    
    private boolean isAgent(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_AGENT"));
    }
    
    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    } 
    
    private boolean isEmployee(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_EMPLOYEE"));
    }
    
    @Override
    public String getUserRole() {
        String userLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(isCustomer(authentication)) return "CUSTOMER";
        if(isAgent(authentication)) return "AGENT";
        if(isEmployee(authentication)) return "EMPLOYEE";
        if(isAdmin(authentication)) return "ADMIN";
        return "NOTALLOWED";
    }

    @Override
    public void checkSameUserOrRole(Long agentId) {
        CustomUserDetails customUserDetails=checkUserAccess();
        String role=getUserRole();
        if(!((Objects.equals(role, "AGENT") && customUserDetails.getId().equals(agentId))||
                Objects.equals(role, "EMPLOYEE")|| (Objects.equals(role, "ADMIN")))){
                    throw new RoleAccessException("you don't have access");
        }

    }

    @Override
    public void checkEmployeeServiceAccess(Long customerId) {
        CustomUserDetails customUserDetails=checkUserAccess();
        String userRole= getUserRole();
        if(!(userRole.equals("ADMIN") || userRole.equals("EMPLOYEE") || customUserDetails.getId().equals(customerId))){
            throw new RoleAccessException("you don't have access");
        }
    }

    @Override
    public void checkEmployeeAdminAccess(Long employeeId) {
        CustomUserDetails customUserDetails=checkUserAccess();
        String userRole= getUserRole();
        if(!(userRole.equals("ROLE_ADMIN") || customUserDetails.getId().equals(employeeId))){
            throw new RoleAccessException("you don't have access");
        }
    }

    @Override
    public void checkAdminAccess() {
        CustomUserDetails customUserDetails=checkUserAccess();
        String userRole= getUserRole();
        if(!(userRole.equals("ADMIN"))){
            throw new RoleAccessException("you don't have access");
        }
    }

    @Override
    public void checkDocumentAccess(Long documentId) {
        String role=getUserRole();
        if(!(Objects.equals(role, "ADMIN")|| Objects.equals(role, "EMPLOYEE") || checkUserAccess(documentId))){
            throw new RoleAccessException("you don't have access to this document");
        }
    }

    @Override
    public void checkDocumentDeleteAccess(Long documentId) {
        String role=getUserRole();
        if(!(Objects.equals(role, "ADMIN")|| Objects.equals(role, "EMPLOYEE") || customerDocumentAccess(documentId))){
            throw new RoleAccessException("you don't have access to this document");
        }
    }

    @Override
    public void checkEmployeeAccess() {
        String role=getUserRole();
        if(!(Objects.equals(role, "EMPLOYEE") || Objects.equals(role, "ADMIN"))){
            throw new RoleAccessException("you don't have access to this document");
        }
    }

    @Override
    public void checkCustomerAccess(Long customerId) {
        String role=getUserRole();
        CustomUserDetails customUserDetails=checkUserAccess();
        if(!((role.equals("CUSTOMER") && customUserDetails.getId().equals(customerId)) ||
                role.equals("EMPLOYEE")|| role.equals("ADMIN"))){
            throw new RoleAccessException("you don't have access to this document");
        }
    }

    @Override
    public void checkPolicyAccountAccess(Long id) {
        CustomUserDetails customUserDetails=checkUserAccess();
        String role=getUserRole();
        if(role.equals("AGENT")){
            Agent agent=agentRepository.findById(customUserDetails.getId()).
                    orElseThrow(()->new UserException("agent not found"));
            boolean isSuccess=agent.getPolicyAccounts().stream().
                    anyMatch(account -> account.getPolicyAccountId().equals(id));
            if(!isSuccess) throw new RoleAccessException("you don't have access to see these transactions");
        }
        if(role.equals("CUSTOMER")){
            Customer customer=customerRepository.findById(customUserDetails.getId()).
                    orElseThrow(()->new UserException("agent not found"));
            boolean isSuccess=customer.getPolicyAccounts().stream().
                    anyMatch(account -> account.getPolicyAccountId().equals(id));
            if(!isSuccess) throw new RoleAccessException("you don't have access to see these transactions");
        }
    }

    private boolean checkUserAccess(Long documentId) {
        CustomUserDetails customUserDetails= checkUserAccess();
        String role= getUserRole();
        if(role.equals("AGENT")){
            Long agentId=customUserDetails.getId();
            Agent agent=findAgent(agentId);
            boolean hisDocument= agent.getDocuments()
                    .stream()
                    .anyMatch(doc -> Objects.equals(doc.getDocumentId(), documentId));
            if(hisDocument) return  true;

            List<PolicyAccount> policyAccountList = agent.getPolicyAccounts();
            return policyAccountList.stream()
                    .map(PolicyAccount::getCustomer)                  // Get the Customer from each PolicyAccount
                    .filter(Objects::nonNull)                         // Filter out null Customers
                    .flatMap(customer -> customer.getDocuments().stream())  // Flatten the stream of List<DocumentUploaded>
                    .anyMatch(document -> Objects.equals(document.getDocumentId(), documentId));

        }
       return customerDocumentAccess(documentId);
    }

    private boolean customerDocumentAccess(Long documentId) {
        CustomUserDetails customUserDetails= checkUserAccess();
        String role= getUserRole();
        if(role.equals("CUSTOMER")){
            Long customerId=customUserDetails.getId();
            Customer customer=findCustomer(customerId);
            return customer.getDocuments()
                    .stream()
                    .anyMatch(doc -> Objects.equals(doc.getDocumentId(), documentId));
        }
        return false;
    }

    private Agent findAgent(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }
    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }
}
