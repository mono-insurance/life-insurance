package com.monocept.app.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AccessConServiceImp implements AccessConService{
    @Override
    public String checkUserAccess() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
