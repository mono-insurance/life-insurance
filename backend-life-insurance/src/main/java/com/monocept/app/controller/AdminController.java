package com.monocept.app.controller;

import java.util.List;


import com.monocept.app.dto.*;
import com.monocept.app.service.*;
import com.monocept.app.utils.PagedResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @Autowired
    private StateService stateService;

    @Autowired
    private InsuranceTypeService insuranceTypeService;

    @Autowired
    private CityService cityService;

    public AdminController(AdminService adminService, AgentService agentService) {
        this.adminService = adminService;
        this.agentService = agentService;
    }



    @PutMapping("/approve-agent/{aid}/{isApproved}")
    ResponseEntity<Boolean> approveAgent(
            @PathVariable("aid")Long agentId,
            @PathVariable("isApproved") Boolean isApproved) {
        Boolean isSuccess = agentService.approveAgent(agentId,isApproved);
        return new ResponseEntity<>(isSuccess, HttpStatus.OK);
    }
    @Operation(summary = "By Admin: Get All Registered Agents")
    @GetMapping("/registered-agents")
    public ResponseEntity<PagedResponse<AgentDTO>> getAllRegisteredAgents(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "agentId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<AgentDTO> employees = adminService.getAllRegisteredAgents(page, size, sortBy, direction);

        return new ResponseEntity<>(employees, HttpStatus.OK);

    }
    @Operation(summary = "By Admin: Delete Policy")
    @DeleteMapping("/policy/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable(name = "id") Long id) {

        policyService.deletePolicy(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Add Policy")
    @PostMapping(value = "/policy",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    ResponseEntity<PolicyDTO> addPolicy( @ModelAttribute @Valid PolicyDTO policyDTO, @RequestParam("file") MultipartFile file) {

        System.out.println("Policy DTO: " + policyDTO);
        PolicyDTO savedPolicy = policyService.addPolicy(policyDTO,file);

        return new ResponseEntity<>(savedPolicy, HttpStatus.OK);
    }



    @Operation(summary = "By Admin: Get the admin profile")
    @GetMapping
    public ResponseEntity<AdminCreationDTO> getAdminProfile() {

    	AdminCreationDTO admin = adminService.getAdminProfile();
        return new ResponseEntity<AdminCreationDTO>(admin, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get all the documentNeeded")
    @GetMapping("/documentTypes")
    public ResponseEntity<List<InsuranceTypeDTO>> getInsuranceTypes() {

        List<InsuranceTypeDTO> documentNeededDTOS = adminService.getInsuranceTypes();
        return new ResponseEntity<>(documentNeededDTOS, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Update admin profile")
    @PutMapping
    public ResponseEntity<AdminCreationDTO> updateAdminProfile(@RequestBody @Valid AdminCreationDTO adminDTO) {

    	AdminCreationDTO admin = adminService.updateAdminProfile(adminDTO);
        return new ResponseEntity<AdminCreationDTO>(admin, HttpStatus.OK);
    }


    @Operation(summary = "By Admin: Make Another admin")
    @PostMapping("/create/admin")
    public ResponseEntity<AdminDTO> makeAnotherAdmin(@RequestBody @Valid AdminCreationDTO adminCreationDTO) {

        AdminDTO admin = adminService.makeAnotherAdmin(adminCreationDTO);

        return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add State")
    @PostMapping("/state")
    public ResponseEntity<StateDTO> addState(@RequestBody @Valid StateDTO stateDTO) {

        StateDTO state = stateService.addState(stateDTO);

        return new ResponseEntity<StateDTO>(state, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Delete State")
    @DeleteMapping("/state/{id}")
    public ResponseEntity<String> deleteState(@PathVariable(name = "id") Long id) {

        stateService.deleteState(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Add City")
    @PostMapping("/city")
    public ResponseEntity<CityDTO> addCity(@RequestBody @Valid CityDTO cityDTO) {

        CityDTO city = cityService.addCity(cityDTO);

        return new ResponseEntity<CityDTO>(city, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Delete City")
    @DeleteMapping("/city/{id}")
    public ResponseEntity<String> deleteCity(@PathVariable(name = "id") Long id) {

        cityService.deleteCity(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }
    @Operation(summary = "By Admin: Add Insurance type")
    @PostMapping("/insurance/type")
    public ResponseEntity<InsuranceTypeDTO> addInsuranceType(@RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO) {

        InsuranceTypeDTO insuranceType = insuranceTypeService.addInsuranceType(insuranceTypeDTO);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: Delete Insurance type")
    @DeleteMapping("/insurance/type/{id}")
    public ResponseEntity<String> deleteInsuranceType(@PathVariable(name = "id") Long id) {

        insuranceTypeService.deleteInsuranceType(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }


	@Operation(summary = "By Admin: whole System Stats")
	@GetMapping("/counts")
	public ResponseEntity<SystemCounts> wholeSystemStats() {
		SystemCounts counts = adminService.wholeSystemStats();
		
		return new ResponseEntity<SystemCounts>(counts,HttpStatus.OK);
	}

	
    @Operation(summary = "By Customer: Get New Users")
    @GetMapping("/new/users")
    public ResponseEntity<PagedResponse<UserDTO>> getNewUsers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "direction", defaultValue = "desc") String direction) {

        PagedResponse<UserDTO> policyAccounts = adminService.getNewUsers(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<UserDTO>>(policyAccounts, HttpStatus.OK);

    }

    @Operation(summary = "By admin: approve document")
    @PostMapping("/document/approve/{id}")
    public ResponseEntity<Boolean> approveDocuments(@PathVariable(name="id") Long id) {

        boolean isApproved = adminService.approveDocuments(id);

        return new ResponseEntity<>(isApproved, HttpStatus.OK);

    }


}
