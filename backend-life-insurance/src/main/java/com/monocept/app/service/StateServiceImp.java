package com.monocept.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.StateDTO;
import com.monocept.app.entity.State;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.PagedResponse;

@Service
public class StateServiceImp implements StateService{
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
    private StateRepository stateRepository;
    @Autowired
    private AccessConService accessConService;

	
	@Override
	public StateDTO addState(StateDTO stateDTO) {
        accessConService.checkAdminAccess();
		stateDTO.setStateId(0L);
		State state = dtoService.convertStateDtoToEntity(stateDTO);
		state.setIsActive(true);
		State savedState = stateRepository.save(state);
	    return dtoService.convertStateToStateDTO(savedState);
	}
	
	
	@Override
	public void deleteState(Long id) {
        accessConService.checkAdminAccess();
		State existingState = stateRepository.findById(id)
	            .orElseThrow(() -> new UserException("State not found"));
		
		if(!existingState.getIsActive()) {
			throw new UserException("This State is already deleted");
		}

		existingState.setIsActive(false);
		stateRepository.save(existingState);
	}
	
	
    @Override
    public PagedResponse<StateDTO> getAllStates(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<State> pages = stateRepository.findAll(pageable);
        List<State> allStates = pages.getContent();
//		System.out.println(allStates);
        List<StateDTO> allStatesDTO = dtoService.convertStateListEntityToDTO(allStates);

        return new PagedResponse<StateDTO>(allStatesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    @Override
    public StateDTO updateState(Long id, StateDTO stateDTO) {
        accessConService.checkEmployeeAccess();
        State existingState = stateRepository.findById(id)
                .orElseThrow(() -> new UserException("State not found"));
        
        if(!existingState.getIsActive()) {
			throw new UserException("Cannot update an inactive states");
		}

        existingState.setStateName(stateDTO.getStateName());
        existingState.setIsActive(stateDTO.getIsActive());

        State updatedState = stateRepository.save(existingState);
        return dtoService.convertStateToStateDTO(updatedState);
    }
    
    
    @Override
    public PagedResponse<StateDTO> getAllActivatedStates(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<State> pages = stateRepository.findByIsActiveTrue(pageable);
        List<State> allStates = pages.getContent();
//		System.out.println(allStates);
        List<StateDTO> allStatesDTO = dtoService.convertStateListEntityToDTO(allStates);

        return new PagedResponse<StateDTO>(allStatesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    @Override
    public PagedResponse<StateDTO> getAllInactivatedStates(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<State> pages = stateRepository.findByIsActiveFalse(pageable);
        List<State> allStates = pages.getContent();
//		System.out.println(allStates);
        List<StateDTO> allStatesDTO = dtoService.convertStateListEntityToDTO(allStates);

        return new PagedResponse<StateDTO>(allStatesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


	@Override
	public StateDTO activateState(Long id) {
        accessConService.checkEmployeeAccess();
		State existingState = stateRepository.findById(id)
                .orElseThrow(() -> new UserException("State not found"));
		
		if(existingState.getIsActive()) {
			throw new UserException("State is already active");
		}
		
		existingState.setIsActive(true);
		State updatedState = stateRepository.save(existingState);
        return dtoService.convertStateToStateDTO(updatedState);
		
	}

}
