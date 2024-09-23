package com.monocept.app.service;

import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.entity.*;
import com.monocept.app.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.entity.InsuranceType;
import com.monocept.app.entity.Policy;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.DocumentNeededRepository;
import com.monocept.app.repository.InsuranceTypeRepository;
import com.monocept.app.repository.PolicyRepository;
import com.monocept.app.utils.DocumentType;
import com.monocept.app.utils.PagedResponse;

@Service
public class PolicyServiceImp implements PolicyService{
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
	private ImageService imageService;
	
	@Autowired
    private InsuranceTypeRepository insuranceTypeRepository;
	
	@Autowired
    private PolicyRepository policyRepository;
	
	@Autowired
    private DocumentNeededRepository documentNeededRepository;
	@Autowired
	private AccessConService accessConService;
	@Autowired
	private CustomerRepository customerRepository;
	
	
	@Override
	public PolicyDTO addPolicy(PolicyDTO policyDTO, MultipartFile file) {
		accessConService.checkAdminAccess();
	    InsuranceType insuranceType = insuranceTypeRepository.findById(policyDTO.getInsuranceTypeId())
	            .orElseThrow(() -> new UserException("InsuranceType not found with id " + policyDTO.getInsuranceTypeId()));
	    
	    policyDTO.setPolicyId(0L);
	    Policy policy = dtoService.convertPolicyDtoToEntity(policyDTO);
	    policy.setIsActive(true);
	    policy.setInsuranceType(insuranceType);
	    
	    if (policyDTO.getDocumentsNeeded() != null && !policyDTO.getDocumentsNeeded().isEmpty()) {
	        List<DocumentNeeded> documentNeededEntities = policyDTO.getDocumentsNeeded()
	            .stream()
	            .map(dto -> {
	                try {
	                    // Convert string to DocumentType enum
	                    DocumentType documentType = DocumentType.valueOf(dto.toUpperCase());

	                    // Find existing DocumentNeeded or create a new one
	                    DocumentNeeded documentNeeded = documentNeededRepository.findByDocumentType(documentType)
	                            .orElseGet(() -> {
	                                DocumentNeeded newDocument = new DocumentNeeded();
	                                newDocument.setDocumentType(documentType);
	                                return documentNeededRepository.save(newDocument);
	                            });
	                    return documentNeeded;

	                } catch (IllegalArgumentException e) {
	                    // If documentType is not valid, throw an error
	                    throw new UserException("Invalid document type: " + dto);
	                }
	            })
	            .collect(Collectors.toList());

	        // Set the documents needed to the policy
	        policy.setDocumentsNeeded(documentNeededEntities);
	    }
	    
	    insuranceType.getPolicies().add(policy);
	    Policy savedPolicy = policyRepository.save(policy);
		imageService.saveImage(file,savedPolicy);
	    
	    return dtoService.convertPolicyToDTO(savedPolicy);
	}



	@Override
	@CacheEvict(value = "policy", key = "#id")
	public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
		accessConService.checkEmployeeAccess();
		Policy existingPolicy = policyRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy not found with id " + id));
		
		InsuranceType insuranceType = insuranceTypeRepository.findById(policyDTO.getInsuranceTypeId())
	            .orElseThrow(() -> new UserException("InsuranceType not found with id " + policyDTO.getInsuranceTypeId()));
		
		if (!insuranceType.getIsActive()) {
	        throw new UserException("Cannot update policy in an inactive insurance category");
	    }
		
//		if (!existingPolicy.getIsActive()) {
//	        throw new UserException("Cannot update an inactive policy");
//	    }
		
		existingPolicy.setPolicyName(policyDTO.getPolicyName());
	    existingPolicy.setCommissionNewRegistration(policyDTO.getCommissionNewRegistration());
	    existingPolicy.setCommissionInstallment(policyDTO.getCommissionInstallment());
	    existingPolicy.setIsActive(policyDTO.getIsActive());
	    existingPolicy.setDescription(policyDTO.getDescription());
	    existingPolicy.setMinPolicyTerm(policyDTO.getMinPolicyTerm());
	    existingPolicy.setMaxPolicyTerm(policyDTO.getMaxPolicyTerm());
	    existingPolicy.setMinAge(policyDTO.getMinAge());
	    existingPolicy.setMaxAge(policyDTO.getMaxAge());
	    existingPolicy.setEligibleGender(policyDTO.getEligibleGender());
	    existingPolicy.setMinInvestmentAmount(policyDTO.getMinInvestmentAmount());
	    existingPolicy.setMaxInvestmentAmount(policyDTO.getMaxInvestmentAmount());
	    existingPolicy.setProfitRatio(policyDTO.getProfitRatio());
	    existingPolicy.setCreatedDate(policyDTO.getCreatedDate());
	    if (policyDTO.getDocumentsNeeded() != null) {

            existingPolicy.setDocumentsNeeded(policyDTO.getDocumentsNeeded().stream()
            		.map(documentName -> {
            			DocumentType documentType = DocumentType.valueOf(documentName.toUpperCase());
            			DocumentNeeded documentNeeded = documentNeededRepository.findByDocumentType(documentType)
                                .orElseThrow(() -> new UserException("DocumentNeeded not found with name " + documentName));
                        return documentNeeded;
                    })
                    .collect(Collectors.toList()
                    ));
        }

	    
		if (!existingPolicy.getInsuranceType().equals(insuranceType)) {
			    	
			existingPolicy.getInsuranceType().getPolicies().remove(existingPolicy);
	        
			existingPolicy.setInsuranceType(insuranceType);
			insuranceType.getPolicies().add(existingPolicy);
	    }
	    
	    Policy updatedPolicy = policyRepository.save(existingPolicy);

	    return dtoService.convertPolicyToDTO(updatedPolicy);
	}

	@Override
	@CacheEvict(value = "policy", key = "#id")
	public void deletePolicy(Long id) {
		accessConService.checkAdminAccess();
		Policy existingPolicy = policyRepository.findById(id)
	            .orElseThrow(() -> new UserException("Policy not found with id " + id));
		
		
		if (!existingPolicy.getIsActive()) {
	        throw new UserException("Cannot update an inactive policy");
	    }
		
		
		existingPolicy.setIsActive(false);
		
		policyRepository.save(existingPolicy);
		
	}




	@Override
	@Cacheable(value = "policies", key = "#page + '-' + #size + '-' + #sortBy + '-' + #direction")
	public PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Policy> pages = policyRepository.findAllByIsActiveTrue(pageable);
		List<Policy> allPolicies = pages.getContent();
		List<PolicyDTO> allPoliciesDTO = dtoService.convertPolicyListEntityToDTO(allPolicies);
		
		return new PagedResponse<PolicyDTO>(allPoliciesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}

	@Override
	@Cacheable(value = "policy", key = "#policyId")
	public PolicyDTO getPolicyById(Long policyId) {
		Policy policy=policyRepository.findById(policyId).orElseThrow(()->new UserException("policy not found"));
		return dtoService.convertPolicyToDTO(policy);
	}



	@Override
	public PagedResponse<PolicyDTO> getAllActivePolicies(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Policy> pages = policyRepository.findByIsActiveTrue(pageable);
		List<Policy> allPolicies = pages.getContent();
		List<PolicyDTO> allPoliciesDTO = dtoService.convertPolicyListEntityToDTO(allPolicies);
		
		return new PagedResponse<PolicyDTO>(allPoliciesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}



	@Override
	public PagedResponse<PolicyDTO> getAllInactivePolicies(int page, int size, String sortBy, String direction) {
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
		
		Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
		
		Page<Policy> pages = policyRepository.findByIsActiveFalse(pageable);
		List<Policy> allPolicies = pages.getContent();
		List<PolicyDTO> allPoliciesDTO = dtoService.convertPolicyListEntityToDTO(allPolicies);
		
		return new PagedResponse<PolicyDTO>(allPoliciesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}
	@Override
	public Boolean isCustomerEligible(Long policyId) {
		CustomUserDetails customUserDetails=accessConService.checkUserAccess();
		Customer customer=findCustomerById(customUserDetails.getId());
		Policy policy=findPolicyById(policyId);

		return isEligible(customer,policy);
	}

	private Boolean isEligible(Customer customer, Policy policy) {

		if (!policy.getIsActive()) {
			throw new UserException("The policy is not active");
		}
		// Validate the customer's age
		int age = LocalDate.now().getYear() - customer.getDateOfBirth().getYear();
		if (age < policy.getMinAge() || age > policy.getMaxAge()) {
			throw new UserException("Customer's age is not within the allowed range for this policy");
		}

		// Validate the customer's gender
		if (!policy.getEligibleGender().equalsIgnoreCase("BOTH") &&
				!policy.getEligibleGender().equalsIgnoreCase(customer.getGender().toString())) {
			throw new UserException("Customer's gender is not eligible for this policy");
		}
		List<DocumentNeeded>policyDocumentsNeeded=policy.getDocumentsNeeded();
		List<DocumentUploaded>documentUploadedList=customer.getDocuments();
		Set<DocumentType> uploadedDocumentTypes = documentUploadedList.stream()
				.filter(DocumentUploaded::getIsApproved)
				.map(DocumentUploaded::getDocumentType) // Assuming DocumentUploaded has getDocumentType()
				.collect(Collectors.toSet());

		// Check if all needed documents are present in the uploaded documents
		return policyDocumentsNeeded.stream()
				.allMatch(neededDoc -> uploadedDocumentTypes.contains(neededDoc.getDocumentType())); // Assuming DocumentNeeded has getDocumentType()

	}

	private Policy findPolicyById(Long policyId) {
		return policyRepository.findById(policyId).orElseThrow(()->new UserException("policy not found"));
	}

	private Customer findCustomerById(Long id) {
		return customerRepository.findById(id).orElseThrow(()->new UserException("customer not found"));
	}


	@Override
	public List<PolicyDTO> getListOfAllActivePolicies() {
		List<Policy> policy = policyRepository.findByIsActiveTrue();
		
		return dtoService.convertPolicyListEntityToDTO(policy);
	}



	@Override
	public List<PolicyDTO> getListOfAllActivePoliciesByInsurance(Long id) {
		InsuranceType insuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("InsuranceType not found with id "));
		
		List<Policy> policy = policyRepository.findByIsActiveTrueAndInsuranceType(insuranceType);
		
		return dtoService.convertPolicyListEntityToDTO(policy);
	}


}
