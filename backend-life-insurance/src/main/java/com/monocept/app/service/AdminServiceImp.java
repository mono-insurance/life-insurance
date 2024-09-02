package com.monocept.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.AdminResponseDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Credentials;
import com.monocept.app.repository.AdminRepository;

@Service
public class AdminServiceImp implements AdminService{
	
	private AccessConServiceImp accessConServiceImp;
    private AdminRepository adminRepository;
    
    
	@Autowired
    public AdminServiceImp(AccessConServiceImp accessConServiceImp, AdminRepository adminRepository) {
        this.accessConServiceImp = accessConServiceImp;
        this.adminRepository = adminRepository;
    }

	@Override
	public AdminResponseDTO getAdminProfile() {
		CustomUserDetails userDetails = accessConServiceImp.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new RuntimeException("Admin not found"));
		
		return convertToAdminResponseDTO(admin);
	}
	
	
	private AdminResponseDTO convertToAdminResponseDTO(Admin admin) {
        return new AdminResponseDTO(
            admin.getAdminId(),
            admin.getFirstName(),
            admin.getLastName(),
            convertToCredentialsDTO(admin.getCredentials())
        );
    }

    private CredentialsDTO convertToCredentialsDTO(Credentials credentials) {
        return new CredentialsDTO(
            credentials.getId(),
            credentials.getUsername(),
            credentials.getEmail(),
            credentials.getMobileNumber(),
            credentials.getRole().getName()
        );
    }
	
	

}
