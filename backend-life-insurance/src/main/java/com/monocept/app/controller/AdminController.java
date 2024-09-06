package com.monocept.app.controller;

import com.monocept.app.service.StorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.monocept.app.dto.AdminCreationDTO;
import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CityDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.dto.StateDTO;
import com.monocept.app.service.AdminService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/suraksha")
public class AdminController {

	@Autowired
    private AdminService adminService;


    @Operation(summary = "By Admin: Get the admin profile")
    @GetMapping
    public ResponseEntity<AdminDTO> getAdminProfile() {

        AdminDTO admin = adminService.getAdminProfile();
        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Update admin profile")
    @PutMapping
    public ResponseEntity<AdminDTO> updateAdminProfile(@RequestBody @Valid AdminDTO adminDTO) {

        AdminDTO admin = adminService.updateAdminProfile(adminDTO);
        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Make Another admin")
    @PostMapping("/create/admin")
    public ResponseEntity<AdminDTO> makeAnotherAdmin(@RequestBody @Valid AdminCreationDTO adminCreationDTO) {

        AdminDTO admin = adminService.makeAnotherAdmin(adminCreationDTO);

        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);

    }
    
    
    
    

}
