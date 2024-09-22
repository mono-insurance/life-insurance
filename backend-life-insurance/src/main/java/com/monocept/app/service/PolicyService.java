package com.monocept.app.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.utils.PagedResponse;

public interface PolicyService {

	PolicyDTO addPolicy(PolicyDTO policyDTO, MultipartFile file);

	PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);

	void deletePolicy(Long id);

	PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction);

    PolicyDTO getPolicyById(Long policyId);

	PagedResponse<PolicyDTO> getAllActivePolicies(int page, int size, String sortBy, String direction);

	PagedResponse<PolicyDTO> getAllInactivePolicies(int page, int size, String sortBy, String direction);

	List<PolicyDTO> getListOfAllActivePolicies();

	List<PolicyDTO> getListOfAllActivePoliciesByInsurance(Long id);
}
