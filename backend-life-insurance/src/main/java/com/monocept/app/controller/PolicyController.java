package com.monocept.app.controller;

import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.service.InsuranceTypeService;
import com.monocept.app.service.PolicyService;
import com.monocept.app.service.StorageService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/suraksha")
public class PolicyController {
	
	@Autowired
	private PolicyService policyService;
	
    private final StorageService storageService;

    public PolicyController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName) {
        byte[] data = storageService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
    
    
    
    
	@Operation(summary = "By Admin: Add Policy")
	@PostMapping(value = "/policy", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<PolicyDTO> addPolicy(
	        @ModelAttribute @Valid PolicyDTO policyDTO,
	        @RequestParam("image") MultipartFile image) {

	    System.out.println("Policy DTO: " + policyDTO);
	    System.out.println("Image: " + image.getOriginalFilename());
	    PolicyDTO savedPolicy = policyService.addPolicy(policyDTO, image);

	    return new ResponseEntity<>(savedPolicy, HttpStatus.OK);
	}
	
	@Operation(summary = "By Admin: update Policy")
	@PutMapping("/policy/{id}")
	public ResponseEntity<PolicyDTO> updatePolicy(@PathVariable(name = "id") Long id, @RequestBody @Valid PolicyDTO policyDTO) {
	
	    PolicyDTO policy = policyService.updatePolicy(id, policyDTO);
	
	    return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);
	
	}
	
	
	@Operation(summary = "By Admin: Delete Policy")
	@DeleteMapping("/policy/{id}")
	public ResponseEntity<String> deletePolicy(@PathVariable(name = "id") Long id) {
	
		policyService.deletePolicy(id);
	
	return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);
	
	}
	
	
	
	
	@Operation(summary = "By Admin: Get All Policies")
	@GetMapping("/policy")
	public ResponseEntity<PagedResponse<PolicyDTO>> getAllPolicies(
	        @RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
	
	    PagedResponse<PolicyDTO> policies = policyService.getAllPolicies(page, size, sortBy, direction);
	
	    return new ResponseEntity<PagedResponse<PolicyDTO>>(policies, HttpStatus.OK);
	
	}
	
    
}
