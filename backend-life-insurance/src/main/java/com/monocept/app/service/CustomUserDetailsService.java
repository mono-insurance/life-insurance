package com.monocept.app.service;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.entity.Credentials;
import com.monocept.app.repository.AuthRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private AuthRepository authRepository;

    public CustomUserDetailsService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("username is "+username);
        Credentials user =  authRepository.findByUsername(username);
        String roleName=user.getRole().getName();
        Set<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(roleName));
        
        
        return new CustomUserDetails(user.getId(), user.getUsername(), user.getPassword(), authorities);

    }
}