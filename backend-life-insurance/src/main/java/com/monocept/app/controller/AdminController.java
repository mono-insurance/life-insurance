package com.monocept.app.controller;

import java.time.LocalDate;
import java.util.List;


import com.monocept.app.dto.*;
import com.monocept.app.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.monocept.app.service.AdminService;
import com.monocept.app.utils.PagedResponse;

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
    public ResponseEntity<AdminDTO> makeAnotherAdmin(@RequestBody @Valid CredentialsDTO credentials) {

        AdminDTO admin = adminService.makeAnotherAdmin(credentials);

        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Create Employee")
    @PostMapping("/employee")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody @Valid CredentialsDTO credentials) {

        EmployeeDTO employee = adminService.createEmployee(credentials);

        return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);

    }

//    @Operation(summary = "By Admin: Update Employee")
//    @PutMapping("/employee/{id}")
//    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable(name = "id") Long id, @RequestBody @Valid EmployeeDTO employeeDTO) {
//
//        EmployeeDTO employee = adminService.updateEmployee(id, employeeDTO);
//
//        return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);
//
//    }


    @Operation(summary = "By Admin: Delete Employee")
    @DeleteMapping("/employee/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable(name = "id") Long id) {

        adminService.deleteEmployee(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add State")
    @PostMapping("/state")
    public ResponseEntity<StateDTO> addState(@RequestBody @Valid StateDTO stateDTO) {

        StateDTO state = adminService.addState(stateDTO);

        return new ResponseEntity<StateDTO>(state, HttpStatus.OK);

    }



    @PostMapping("/insurance/{iid}/upload-insurance-images")
    ResponseEntity<Boolean> addNewInsuranceImages(
            @PathVariable("iid") Long insuranceId,
            @RequestParam("file") MultipartFile file) {
        Boolean isAdded = storageService.addNewInsuranceImages(insuranceId, file);
        return new ResponseEntity<>(isAdded, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Delete State")
    @DeleteMapping("/state/{id}")
    public ResponseEntity<String> deleteState(@PathVariable(name = "id") Long id) {

        adminService.deleteState(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }

    @Operation(summary = "By Admin: Add City")
    @PostMapping("/city")
    public ResponseEntity<CityDTO> addCity(@RequestBody @Valid CityDTO cityDTO) {

        CityDTO city = adminService.addCity(cityDTO);

        return new ResponseEntity<CityDTO>(city, HttpStatus.OK);

    }




    @Operation(summary = "By Admin: Delete City")
    @DeleteMapping("/city/{id}")
    public ResponseEntity<String> deleteCity(@PathVariable(name = "id") Long id) {

        adminService.deleteCity(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add Insurance type")
    @PostMapping("/insurance/type")
    public ResponseEntity<InsuranceTypeDTO> addInsuranceType(@RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO) {

        InsuranceTypeDTO insuranceType = adminService.addInsuranceType(insuranceTypeDTO);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: update Insurance type")
    @PutMapping("/insurance/type/{id}")
    public ResponseEntity<InsuranceTypeDTO> updateInsuranceType(@PathVariable(name = "id") Long id, @RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO) {

        InsuranceTypeDTO insuranceType = adminService.updateInsuranceType(id, insuranceTypeDTO);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Delete Insurance type")
    @DeleteMapping("/insurance/type/{id}")
    public ResponseEntity<String> deleteInsuranceType(@PathVariable(name = "id") Long id) {

        adminService.deleteInsuranceType(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add Policy")
    @PostMapping("/policy")
    public ResponseEntity<PolicyDTO> addPolicy(@RequestBody @Valid PolicyDTO policyDTO) {

        PolicyDTO policy = adminService.addPolicy(policyDTO);

        return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: update Policy")
    @PutMapping("/policy/{id}")
    public ResponseEntity<PolicyDTO> updatePolicy(@PathVariable(name = "id") Long id, @RequestBody @Valid PolicyDTO policyDTO) {

        PolicyDTO policy = adminService.updatePolicy(id, policyDTO);

        return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Delete Policy")
    @DeleteMapping("/policy/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable(name = "id") Long id) {

        adminService.deletePolicy(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }




    @Operation(summary = "By Admin: Get All Policies")
    @GetMapping("/policy")
    public ResponseEntity<PagedResponse<PolicyDTO>> getAllPolicies(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "policyId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<PolicyDTO> policies = adminService.getAllPolicies(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<PolicyDTO>>(policies, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add or Update Setting")
    @PutMapping("/settings/update")
    public ResponseEntity<SettingsDTO> addOrUpdateSetting(@RequestBody @Valid SettingsDTO settingDTO) {
        SettingsDTO updatedSetting = adminService.addOrUpdateSetting(settingDTO);

        return new ResponseEntity<SettingsDTO>(updatedSetting, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Settings")
    @GetMapping("/settings/key")
    public ResponseEntity<SettingsDTO> getSetting(@RequestBody String settingKey) {
        SettingsDTO setting = adminService.getSetting(settingKey);

        return new ResponseEntity<SettingsDTO>(setting, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Get All Employee")
    @GetMapping("/employee")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = adminService.getAllEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Active Employee")
    @GetMapping("/employee/active")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllActiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = adminService.getAllActiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Get All Inactive Employee")
    @GetMapping("/employee/inactive")
    public ResponseEntity<PagedResponse<EmployeeDTO>> getAllInactiveEmployees(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<EmployeeDTO> employees = adminService.getAllInactiveEmployees(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);

    }







    @Operation(summary = "By Admin: Delete Query")
    @DeleteMapping("/query/{id}")
    public ResponseEntity<String> deleteQuery(@PathVariable(name = "id") Long id) {

        adminService.deleteQuery(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }



    @PostMapping("/approve-agent/{aid}")
    ResponseEntity<Boolean> approveAgent(@PathVariable("aid")Long agentId) {
        Boolean isSuccess = adminService.approveAgent(agentId);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }

}
