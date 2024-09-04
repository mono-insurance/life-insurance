package com.monocept.app.controller;


import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	private final AdminService adminService;
	private final StorageService storageService;
	
	public AdminController(AdminService adminService, StorageService storageService) {
		super();
		this.adminService = adminService;
		this.storageService = storageService;
	}
	
	
	@PostMapping("/add-employee")
	ResponseEntity<Boolean> addNewEmployee(@RequestBody @Valid EmployeeDTO employeeDTO){
		Boolean isAdded=adminService.addNewEmployee(employeeDTO);
		return new ResponseEntity<>(isAdded,HttpStatus.OK);
	}

	
	
	@DeleteMapping("/employee/{eid}")
	ResponseEntity<Boolean> deleteEmployee(@PathVariable("eid")Long employeeId){
		Boolean isDeleted=adminService.deleteEmployee(employeeId);
		return new ResponseEntity<>(isDeleted,HttpStatus.OK);
		
		
	}
	@PostMapping("/add-insurance-type")
	ResponseEntity<Boolean> addNewInsuranceType(@RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO){
		Boolean isAdded=adminService.addNewInsuranceType(insuranceTypeDTO);
		return new ResponseEntity<>(isAdded,HttpStatus.OK);
		
		
	}
	
	
	@PostMapping("/add-insurance")
	ResponseEntity<Boolean> addNewInsurance(@RequestBody @Valid PolicyDTO policyDTO){
		Boolean isAdded=adminService.addNewInsurance(policyDTO);
		return new ResponseEntity<>(isAdded,HttpStatus.OK);
	}

	@PostMapping("/insurance/{iid}/upload-insurance-images")
	ResponseEntity<Boolean> addNewInsuranceImages(
			@PathVariable("iid")Long insuranceId,
			@RequestParam("file") MultipartFile file){
		Boolean isAdded=storageService.addNewInsuranceImages(insuranceId,file);
		return new ResponseEntity<>(isAdded,HttpStatus.OK);
	}
	
	
	@DeleteMapping("/insurance-images/{iid}")
	ResponseEntity<Boolean> deleteImage(@PathVariable("iid")int imageId){
		Boolean isDeleted= adminService.deleteImage(imageId);
		return new ResponseEntity<>(isDeleted,HttpStatus.OK);
	}
	@DeleteMapping("/insurance/{iid}")
	ResponseEntity<Boolean> deleteInsurance(@PathVariable("iid")int insuranceId){
		Boolean isDeleted=adminService.deleteInsurance(insuranceId);
		return new ResponseEntity<>(isDeleted,HttpStatus.OK);
	}
	
	@Operation(summary = "By Admin: Get the admin profile")
	@GetMapping
	public ResponseEntity<AdminDTO> getAdminProfile(){
		
		AdminDTO admin = adminService.getAdminProfile();
		
		return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);

	}

}
