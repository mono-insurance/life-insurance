package com.monocept.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.entity.InsuranceType;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.InsuranceTypeRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.PagedResponse;


@Service
public class InsuranceTypeServiceImp implements InsuranceTypeService{
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
    private InsuranceTypeRepository insuranceTypeRepository;

	@Override
	public InsuranceTypeDTO addInsuranceType(InsuranceTypeDTO insuranceTypeDTO) {

	    insuranceTypeDTO.setTypeId(0L);
	    InsuranceType insuranceType = dtoService.convertInsuranceTypeDtoToEntity(insuranceTypeDTO);
	    insuranceType.setIsActive(true);
	    
	    InsuranceType savedInsuranceType = insuranceTypeRepository.save(insuranceType);
	    return dtoService.convertInsuranceTypeToDTO(savedInsuranceType);
	}

	@Override
	public InsuranceTypeDTO updateInsuranceType(Long id, InsuranceTypeDTO insuranceTypeDTO) {
	    InsuranceType existingInsuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Insurance type not found"));

	    if (!existingInsuranceType.getIsActive()) {
	        throw new UserException("Cannot update an inactive insurance type");
	    }

	    existingInsuranceType.setInsuranceCategory(insuranceTypeDTO.getInsuranceCategory());
	    existingInsuranceType.setIsActive(insuranceTypeDTO.getIsActive());

	    InsuranceType updatedInsuranceType = insuranceTypeRepository.save(existingInsuranceType);
	    return dtoService.convertInsuranceTypeToDTO(updatedInsuranceType);
	}

	@Override
	public void deleteInsuranceType(Long id) {
	    InsuranceType existingInsuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Insurance type not found"));

	    if (!existingInsuranceType.getIsActive()) {
	        throw new UserException("This insurance type is already deleted");
	    }

	    existingInsuranceType.setIsActive(false);
	    insuranceTypeRepository.save(existingInsuranceType);
	}
	
    
    
    @Override
    public PagedResponse<InsuranceTypeDTO> getAllInsuranceTypes(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<InsuranceType> pages = insuranceTypeRepository.findAll(pageable);
        List<InsuranceType> allInsuranceTypes = pages.getContent();
        List<InsuranceTypeDTO> allInsuranceTypesDTO = dtoService.convertInsuranceTypeListEntityToDTO(allInsuranceTypes);

        return new PagedResponse<InsuranceTypeDTO>(allInsuranceTypesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    @Override
    public PagedResponse<InsuranceTypeDTO> getAllActivatedInsuranceTypes(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<InsuranceType> pages = insuranceTypeRepository.findByIsActiveTrue(pageable);
        List<InsuranceType> allInsuranceTypes = pages.getContent();
        List<InsuranceTypeDTO> allInsuranceTypesDTO = dtoService.convertInsuranceTypeListEntityToDTO(allInsuranceTypes);

        return new PagedResponse<InsuranceTypeDTO>(allInsuranceTypesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    
    @Override
    public PagedResponse<InsuranceTypeDTO> getAllInactivatedInsuranceTypes(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<InsuranceType> pages = insuranceTypeRepository.findByIsActiveFalse(pageable);
        List<InsuranceType> allInsuranceTypes = pages.getContent();
        List<InsuranceTypeDTO> allInsuranceTypesDTO = dtoService.convertInsuranceTypeListEntityToDTO(allInsuranceTypes);

        return new PagedResponse<InsuranceTypeDTO>(allInsuranceTypesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }

    @Override
    public InsuranceTypeDTO getInsuranceTypeById(Long id) {
        InsuranceType insuranceType = insuranceTypeRepository.findById(id)
                .orElseThrow(() -> new UserException("Insurance type not found"));

        return dtoService.convertInsuranceTypeToDTO(insuranceType);
    }

    @Override
    public InsuranceTypeDTO getAllActivatedInsuranceTypesWithId(Long id) {
        InsuranceType insuranceType = insuranceTypeRepository.findByTypeIdAndIsActiveTrue(id)
                .orElseThrow(() -> new UserException("Active insurance type not found"));

        return dtoService.convertInsuranceTypeToDTO(insuranceType);
    }

	@Override
	public InsuranceTypeDTO activateInsuranceType(Long id) {
		InsuranceType existingInsuranceType = insuranceTypeRepository.findById(id)
	            .orElseThrow(() -> new UserException("Insurance type not found"));

	    if (existingInsuranceType.getIsActive()) {
	        throw new UserException("Insurance Type is already Active");
	    }
	    
	    existingInsuranceType.setIsActive(true);

	    InsuranceType updatedInsuranceType = insuranceTypeRepository.save(existingInsuranceType);
	    return dtoService.convertInsuranceTypeToDTO(updatedInsuranceType);
	}
    

}
