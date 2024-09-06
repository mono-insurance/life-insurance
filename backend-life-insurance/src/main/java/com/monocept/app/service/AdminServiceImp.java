package com.monocept.app.service;

import com.monocept.app.dto.*;

import com.monocept.app.entity.*;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import com.monocept.app.utils.GlobalSettings;
import com.monocept.app.utils.PagedResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImp implements AdminService{
	
	private AccessConService accessConService;
    private AdminRepository adminRepository;
    private DtoService dtoService;
	private PasswordEncoder passwordEncoder;
	private RoleRepository roleRepository;
	
	@Autowired
	private AuthRepository credentialsRepository;
    
    
	@Autowired
    public AdminServiceImp(AccessConService accessConService, AdminRepository adminRepository,
						   DtoService dtoService, RoleRepository roleRepository,
						   PasswordEncoder passwordEncoder) {
		this.accessConService = accessConService;
        this.adminRepository = adminRepository;
        this.dtoService = dtoService;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
	}

	@Override
	public AdminDTO getAdminProfile() {
		CustomUserDetails userDetails = accessConService.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
	
		return dtoService.converAdminToAdminResponseDTO(admin);
	}
	
	
	@Override
	public AdminDTO updateAdminProfile(AdminDTO adminDTO) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
		
		admin.setFirstName(adminDTO.getFirstName());
	    admin.setLastName(adminDTO.getLastName());
	    admin.getCredentials().setUsername(adminDTO.getCredentials().getUsername());
	    admin.getCredentials().setEmail(adminDTO.getCredentials().getEmail());
	    admin.getCredentials().setMobileNumber(adminDTO.getCredentials().getMobileNumber());
	    
	    Admin updatedAdmin = adminRepository.save(admin);
	    
	    return dtoService.converAdminToAdminResponseDTO(updatedAdmin);
	}

	

	@Override
	public AdminDTO makeAnotherAdmin(AdminCreationDTO adminCreationDTO) {
		adminCreationDTO.setAdminId(0L);
		
		Admin admin = new Admin();
		admin.setFirstName(adminCreationDTO.getFirstName());
		admin.setLastName(adminCreationDTO.getLastName());
		Credentials credentials = new Credentials();
		
	    credentials.setUsername(adminCreationDTO.getUsername());
	    credentials.setEmail(adminCreationDTO.getEmail());
	    credentials.setPassword(passwordEncoder.encode(adminCreationDTO.getPassword()));
	    credentials.setMobileNumber(adminCreationDTO.getMobileNumber());
	    
	    Role role = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Role admin not found"));
    	credentials.setRole(role);
    	
    	admin.setCredentials(credentials);
    	credentials.setAdmin(admin);
    	credentials = credentialsRepository.save(credentials);
	    
	    AdminDTO adminDTO = dtoService.converAdminToAdminResponseDTO(credentials.getAdmin());
	    
	    return adminDTO;
		
	}








}
