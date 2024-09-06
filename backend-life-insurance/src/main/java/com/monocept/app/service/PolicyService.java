package com.monocept.app.service;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.utils.PagedResponse;

public interface PolicyService {

	PolicyDTO addPolicy(PolicyDTO policyDTO, MultipartFile file);

	PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);

	void deletePolicy(Long id);

	PagedResponse<PolicyDTO> getAllPolicies(int page, int size, String sortBy, String direction);

    PolicyDTO getPolicyById(Long policyId);
}
