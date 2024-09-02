package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Employee;
import com.monocept.app.entity.Role;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.app.entity.Admin;
import com.monocept.app.repository.AdminRepository;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Service
public class AdminServiceImp implements AdminService{
	
	private AccessConService accessConService;
    private AdminRepository adminRepository;
    private final DtoService dtoService;
	private final EmployeeRepository employeeRepository;
    
    
	@Autowired
    public AdminServiceImp(AccessConService accessConServiceImp, AdminRepository adminRepository,
						   DtoService dtoService, EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
		this.accessConService = accessConService;
        this.adminRepository = adminRepository;
        this.dtoService = dtoService;
    }

	@Override
	public AdminDTO getAdminProfile() {
		String userRole= accessConService.getUserRole();
		if(!Objects.equals(userRole, "ADMIN")){
			throw new RoleAccessException("you don't have access");
		}
		CustomUserDetails userDetails = accessConService.checkUserAccess();
		
		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new RuntimeException("Admin not found"));
		
		return dtoService.convertToAdminResponseDTO(admin);
	}

	@Override
	public Boolean addNewEmployee(EmployeeDTO employeeDTO) {
		try{
			Employee employee =dtoService.convertEmployeeDtoToEmployee(employeeDTO);
//			Credentials newCredential=new Credentials();
//			newCredential.setRole();
			employeeRepository.save(employee);
			return true;
		}
		catch (Exception err){
			err.printStackTrace();
		}
		return false;
	}


	@Override
	public Boolean addNewInsuranceType(InsuranceTypeDTO insuranceTypeDTO) {
		return null;
	}

	@Override
	public Boolean addNewInsurance(PolicyDTO policyDTO) {
		return null;
	}

	@Override
	public Boolean addNewInsuranceImages(int insuranceId, MultipartFile file) {
		return null;
	}

	@Override
	public Boolean deleteImage(int imageId) {
		return null;
	}

	@Override
	public Boolean deleteInsurance(int insuranceId) {
		return null;
	}

	@Override
	public Boolean deleteEmployee(Long employeeId) {
		// TODO Auto-generated method stub
		return null;
	}


}
