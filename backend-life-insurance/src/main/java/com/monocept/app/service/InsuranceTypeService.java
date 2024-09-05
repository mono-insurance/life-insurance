package com.monocept.app.service;

import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.utils.PagedResponse;

public interface InsuranceTypeService {

	InsuranceTypeDTO addInsuranceType(InsuranceTypeDTO insuranceTypeDTO);

	InsuranceTypeDTO updateInsuranceType(Long id, InsuranceTypeDTO insuranceTypeDTO);

	void deleteInsuranceType(Long id);

	PagedResponse<InsuranceTypeDTO> getAllInsuranceTypes(int page, int size, String sortBy, String direction);

	InsuranceTypeDTO getInsuranceTypeById(Long id);

	PagedResponse<InsuranceTypeDTO> getAllActivatedInsuranceTypes(int page, int size, String sortBy, String direction);

	InsuranceTypeDTO getAllActivatedInsuranceTypesWithId(Long id);

	PagedResponse<InsuranceTypeDTO> getAllInactivatedInsuranceTypes(int page, int size, String sortBy,
			String direction);

	InsuranceTypeDTO activateInsuranceType(Long id);

}
