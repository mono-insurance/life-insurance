package com.monocept.app.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;

@Service
public class AccessConServiceImp implements AccessConService{
    @Override
    public CustomUserDetails checkUserAccess() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
