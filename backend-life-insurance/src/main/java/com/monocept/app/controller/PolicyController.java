package com.monocept.app.controller;

import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.service.InsuranceTypeService;
import com.monocept.app.service.PolicyService;
import com.monocept.app.service.StorageService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.util.List;

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
@RequestMapping("/suraksha/policy")
public class PolicyController {
	
	@Autowired
	private PolicyService policyService;
	
    private final StorageService storageService;

    public PolicyController(StorageService storageService) {
        this.storageService = storageService;
    }

	@GetMapping("/download/policy-image/{pid}")
	public ResponseEntity<ByteArrayResource> downloadPolicyImage(@PathVariable("pid") Long pid) {
		byte[] data = storageService.downloadPolicyImage(pid);
		ByteArrayResource resource = new ByteArrayResource(data);
		return ResponseEntity
				.ok()
				.contentLength(data.length)
				.header("Content-type", "image/jpeg")
				.header("Content-disposition", "attachment; filename=\"" + "test" + "\"")
				.body(resource);
	}
	
	
	@PutMapping(value ="/update/policy-image/{pid}" ,consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<ByteArrayResource> updatePolicyImage(@PathVariable("pid") Long pid,@RequestParam("file") MultipartFile file) {
		byte[] data = storageService.updatePolicyImage(pid, file);
		ByteArrayResource resource = new ByteArrayResource(data);
		return ResponseEntity
				.ok()
				.contentLength(data.length)
				.header("Content-type", "image/jpeg")
				.header("Content-disposition", "attachment; filename=\"" + "test" + "\"")
				.body(resource);
	}
	
	
	
//	@Operation(summary = "By Admin: Get the uploaded Files of the Customers")
//	@GetMapping("/files/user/{userId}/{fileNumber}")
//	public ResponseEntity<Object> getUploadedFilesOfUsers(@PathVariable(name = "userId") int customerId,@PathVariable(name = "fileNumber") int fileNumber) {
//		List<byte[]> fileContent = adminService.getFileContent(customerId, fileNumber);
//		
//		byte[] content = fileContent.get(fileNumber-1);
//		System.out.println("image returned");
//		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/png")).body(content);
//	}
	
	
	

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
	
	
	@Operation(summary = "By Admin: Get All Active Policies")
	@GetMapping("/policy/active")
	public ResponseEntity<PagedResponse<PolicyDTO>> getAllActivePolicies(
	        @RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
	
	    PagedResponse<PolicyDTO> policies = policyService.getAllActivePolicies(page, size, sortBy, direction);
	
	    return new ResponseEntity<PagedResponse<PolicyDTO>>(policies, HttpStatus.OK);
	}
	
	
	
	@Operation(summary = "By Admin: Get All Inactive Policies")
	@GetMapping("/policy/inactive")
	public ResponseEntity<PagedResponse<PolicyDTO>> getAllInactivePolicies(
	        @RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction) {
	
	    PagedResponse<PolicyDTO> policies = policyService.getAllInactivePolicies(page, size, sortBy, direction);
	
	    return new ResponseEntity<PagedResponse<PolicyDTO>>(policies, HttpStatus.OK);
	}

	@Operation(summary = "By Admin: Get  policy by id")
	@GetMapping("/policy/{pid}")
	public ResponseEntity<PolicyDTO> getPolicyById(@PathVariable("pid")Long policyId) {

		PolicyDTO policies = policyService.getPolicyById(policyId);

		return new ResponseEntity<>(policies, HttpStatus.OK);
	}
	
	
	

}
