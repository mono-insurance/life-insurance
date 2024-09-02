package com.monocept.app.service;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AdminService {

	AdminDTO getAdminProfile();


    Boolean addNewEmployee(EmployeeDTO employeeDTO);

    Boolean deleteEmployee(Long employeeId);

    Boolean addNewInsuranceType(InsuranceTypeDTO insuranceTypeDTO);

    Boolean addNewInsurance(PolicyDTO policyDTO);

    Boolean addNewInsuranceImages(int insuranceId, MultipartFile file);

    Boolean deleteImage(int imageId);

    Boolean deleteInsurance(int insuranceId);
}
