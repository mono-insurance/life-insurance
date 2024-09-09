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
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {

    	System.out.println(usernameOrEmail+ "234123");
        Credentials credentials =  authRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() ->
                new UsernameNotFoundException("User not found with username or email: "+ usernameOrEmail));
        
        
//        System.out.println(credentials+ "234123i77oiu");
        System.out.println("--------------------------------------------------------------------->");
        String roleName=credentials.getRole().getName();
        System.out.println("ROLE is "+roleName);
        Set<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(roleName));
        
        
        return new CustomUserDetails(credentials.getId(), credentials.getUsername(), credentials.getPassword(), authorities);

    }
}