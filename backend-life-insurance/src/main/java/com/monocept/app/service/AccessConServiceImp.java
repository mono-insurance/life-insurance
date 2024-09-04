package com.monocept.app.service;

import com.monocept.app.exception.RoleAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;

@Service
public class AccessConServiceImp implements AccessConService{
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

    }

    @Override
    public void checkEmployeeServiceAccess(Long employeeId) {
        CustomUserDetails customUserDetails=checkUserAccess();
        String userRole= getUserRole();
        if(!(userRole.equals("ROLE_ADMIN") || customUserDetails.getId().equals(employeeId))){
            throw new RoleAccessException("you don't have access");
        }
    }
}
