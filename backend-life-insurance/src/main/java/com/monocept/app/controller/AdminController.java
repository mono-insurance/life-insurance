package com.monocept.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.AdminResponseDTO;
import com.monocept.app.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	private AdminService adminService;
	
	
	public AdminController(AdminService adminService) {
		super();
		this.adminService = adminService;
	}
	
	
	@Operation(summary = "By Admin: Get the admin profile")
	@GetMapping
	public ResponseEntity<AdminResponseDTO> getAdminProfile(){
		
		AdminResponseDTO admin = adminService.getAdminProfile();
		
		return new ResponseEntity<AdminResponseDTO>(admin, HttpStatus.OK);
		
	}

}
