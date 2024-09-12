package com.monocept.app.service;

import java.util.List;

import com.monocept.app.dto.StateDTO;
import com.monocept.app.utils.PagedResponse;


public interface StateService {

	StateDTO addState(StateDTO stateDTO);

	void deleteState(Long id);

	StateDTO updateState(Long id, StateDTO stateDTO);

	PagedResponse<StateDTO> getAllStates(int page, int size, String sortBy, String direction);

	PagedResponse<StateDTO> getAllActivatedStates(int page, int size, String sortBy, String direction);

	PagedResponse<StateDTO> getAllInactivatedStates(int page, int size, String sortBy, String direction);

	StateDTO activateState(Long id);

	List<StateDTO> getListOfAllActiveStates();

	StateDTO getStateById(Long id);

}
