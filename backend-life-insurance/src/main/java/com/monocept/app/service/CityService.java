package com.monocept.app.service;

import java.util.List;

import com.monocept.app.dto.CityDTO;
import com.monocept.app.utils.PagedResponse;

public interface CityService {

	CityDTO addCity(CityDTO cityDTO);

	void deleteCity(Long id);

	CityDTO updateCity(Long id, CityDTO cityDTO);

	PagedResponse<CityDTO> getAllCities(int page, int size, String sortBy, String direction);

	PagedResponse<CityDTO> getAllActivatedCities(int page, int size, String sortBy, String direction);

	PagedResponse<CityDTO> getAllInactivatedCities(int page, int size, String sortBy, String direction);

	CityDTO activateCity(Long id);

	PagedResponse<CityDTO> getAllActivatedCitiesByStateId(int page, int size, String sortBy, String direction, Long id);

	CityDTO getCityById(Long id);

	List<CityDTO> getListOfAllActiveCitiesByState(String stateName);

	List<CityDTO> getListOfAllActiveCitiesByStateId(Long id);


}
