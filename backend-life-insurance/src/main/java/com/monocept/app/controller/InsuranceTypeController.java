package com.monocept.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.service.InsuranceTypeService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha")
public class InsuranceTypeController {
	

	@Autowired
	private InsuranceTypeService insuranceTypeService;

    @Operation(summary = "By Admin: Add Insurance type")
    @PostMapping("/insurance/type")
    public ResponseEntity<InsuranceTypeDTO> addInsuranceType(@RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO) {

        InsuranceTypeDTO insuranceType = insuranceTypeService.addInsuranceType(insuranceTypeDTO);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }

    @Operation(summary = "By Admin: update Insurance type")
    @PutMapping("/insurance/type/{id}")
    public ResponseEntity<InsuranceTypeDTO> updateInsuranceType(@PathVariable(name = "id") Long id, @RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO) {

        InsuranceTypeDTO insuranceType = insuranceTypeService.updateInsuranceType(id, insuranceTypeDTO);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }


    @Operation(summary = "By Admin: Delete Insurance type")
    @DeleteMapping("/insurance/type/{id}")
    public ResponseEntity<String> deleteInsuranceType(@PathVariable(name = "id") Long id) {

    	insuranceTypeService.deleteInsuranceType(id);

        return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

    }
    
    @Operation(summary = "By Admin: Get All Insurance types")
    @GetMapping("/insurance/type")
    public ResponseEntity<PagedResponse<InsuranceTypeDTO>> getAllInsuranceTypes(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "typeId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<InsuranceTypeDTO> insuranceCategories = insuranceTypeService.getAllInsuranceTypes(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<InsuranceTypeDTO>>(insuranceCategories, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin: Get Insurance types By Id")
    @GetMapping("/insurance/type/{id}")
    public ResponseEntity<InsuranceTypeDTO> getInsuranceTypeById(@PathVariable(name="id")Long id) {

        InsuranceTypeDTO insuranceCategory = insuranceTypeService.getInsuranceTypeById(id);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceCategory, HttpStatus.OK);

    }

    
    @Operation(summary = "By All: Get All Activated Insurance types")
    @GetMapping("/insurance/type/activated")
    public ResponseEntity<PagedResponse<InsuranceTypeDTO>> getAllActivatedInsuranceTypes(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "typeId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<InsuranceTypeDTO> insuranceCategories = insuranceTypeService.getAllActivatedInsuranceTypes(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<InsuranceTypeDTO>>(insuranceCategories, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By All: Get All Activated Insurance types By Id")
    @GetMapping("/insurance/type/activated/{id}")
    public ResponseEntity<InsuranceTypeDTO> getAllActivatedInsuranceTypesWithId(@PathVariable(name="id")Long id) {

        InsuranceTypeDTO insuranceCategory = insuranceTypeService.getAllActivatedInsuranceTypesWithId(id);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceCategory, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin: Get All Inactivated Insurance types")
    @GetMapping("/insurance/type/inactivated")
    public ResponseEntity<PagedResponse<InsuranceTypeDTO>> getAllInactivatedInsuranceTypes(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "typeId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<InsuranceTypeDTO> insuranceCategories = insuranceTypeService.getAllInactivatedInsuranceTypes(page, size, sortBy, direction);

        return new ResponseEntity<PagedResponse<InsuranceTypeDTO>>(insuranceCategories, HttpStatus.OK);

    }
    
    @Operation(summary = "By Admin: Activate Insurance type")
    @PutMapping("/insurance/type/activate/{id}")
    public ResponseEntity<InsuranceTypeDTO> activateInsuranceType(@PathVariable(name = "id") Long id) {

        InsuranceTypeDTO insuranceType = insuranceTypeService.activateInsuranceType(id);

        return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

    }
    
    
}
