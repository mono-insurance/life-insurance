package com.monocept.app.controller;

import java.util.List;


import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.monocept.app.dto.AdminCreationDTO;
import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.service.AdminService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/suraksha/admin")
public class AdminController {

	@Autowired
    private AdminService adminService;
    private final AgentService agentService;
    @Autowired
    private PolicyService policyService;

    public AdminController(AdminService adminService, AgentService agentService) {
        this.adminService = adminService;
        this.agentService = agentService;
    }


    @PostMapping("/approve-agent/{aid}")
    ResponseEntity<Boolean> approveAgent(
            @PathVariable("aid")Long agentId,
            @RequestParam(value = "isApproved" ,defaultValue = "false")Boolean isApproved) {
        Boolean isSuccess = agentService.approveAgent(agentId,isApproved);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Delete Policy")
    @DeleteMapping("/policy/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable(name = "id") Long id) {

        policyService.deletePolicy(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Add Policy")
    @PostMapping(value = "/policy",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<PolicyDTO> addPolicy(
            @ModelAttribute @Valid PolicyDTO policyDTO,
            @RequestParam("file") MultipartFile file
            ) {

        System.out.println("Policy DTO: " + policyDTO);
        PolicyDTO savedPolicy = policyService.addPolicy(policyDTO,file);

        return new ResponseEntity<>(savedPolicy, HttpStatus.OK);
    }



    @Operation(summary = "By Admin: Get the admin profile")
    @GetMapping
    public ResponseEntity<AdminDTO> getAdminProfile() {

        AdminDTO admin = adminService.getAdminProfile();
        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get all the documentNeeded")
    @GetMapping("/documentTypes")
    public ResponseEntity<List<InsuranceTypeDTO>> getInsuranceTypes() {

        List<InsuranceTypeDTO> documentNeededDTOS = adminService.getInsuranceTypes();
        return new ResponseEntity<>(documentNeededDTOS, HttpStatus.OK);
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
