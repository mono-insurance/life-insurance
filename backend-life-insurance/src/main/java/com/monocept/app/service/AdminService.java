package com.monocept.app.service;

import com.monocept.app.dto.AdminResponseDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.InsuranceDetailsDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AdminService {

	AdminResponseDTO getAdminProfile();


    Boolean addNewEmployee(EmployeeDTO employeeDTO);

    Boolean deleteEmployee(Long employeeId);

    Boolean addNewInsuranceType(InsuranceTypeDTO insuranceTypeDTO);

    Boolean addNewInsurance(InsuranceDetailsDTO insuranceDetailsDTO);

    Boolean addNewInsuranceImages(int insuranceId, MultipartFile file);

    Boolean deleteImage(int imageId);

    Boolean deleteInsurance(int insuranceId);
}
