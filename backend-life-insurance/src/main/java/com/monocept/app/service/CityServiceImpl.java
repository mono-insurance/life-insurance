package com.monocept.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CityDTO;
import com.monocept.app.entity.City;
import com.monocept.app.entity.State;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.CityRepository;
import com.monocept.app.repository.StateRepository;
import com.monocept.app.utils.PagedResponse;


@Service
public class CityServiceImpl implements CityService{
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired
    private StateRepository stateRepository;
	
	@Autowired
    private CityRepository cityRepository;

	
	@Override
	public CityDTO addCity(CityDTO cityDTO) {
		State state = stateRepository.findById(cityDTO.getStateId()).orElseThrow(() -> new UserException("State not found"));
		
		if (!state.getIsActive()) {
	        throw new UserException("Cannot add city to an inactive state");
	    }
		
		cityDTO.setCityId(0L);
		City city = dtoService.convertCityDtoToEntity(cityDTO);
		city.setIsActive(true);
		city.setState(state);
		City savedCity = cityRepository.save(city);
		state.getCities().add(savedCity);
	    return dtoService.convertCityToDTO(savedCity);
	}


	@Override
	public void deleteCity(Long id) {
		City existingCity = cityRepository.findById(id)
	            .orElseThrow(() -> new UserException("City not found"));

	    if (!existingCity.getIsActive()) {
	        throw new UserException("This City is already deleted");
	    }

	    existingCity.setIsActive(false);

	    cityRepository.save(existingCity);
		
	}
	
    @Override
    public CityDTO updateCity(Long id, CityDTO cityDTO) {
        City existingCity = cityRepository.findById(id)
                .orElseThrow(() -> new UserException("City not found"));


        State state = stateRepository.findById(cityDTO.getStateId())
                .orElseThrow(() -> new UserException("State not found"));

        if (!state.getIsActive()) {
            throw new UserException("Cannot update city in an inactive state");
        }

//        if (!existingCity.getIsActive()) {
//            throw new UserException("Cannot update city as it is inactive");
//        }


        existingCity.setCityName(cityDTO.getCityName());
        existingCity.setIsActive(cityDTO.getIsActive());
        if (!existingCity.getState().equals(state)) {

            existingCity.getState().getCities().remove(existingCity);

            existingCity.setState(state);
            state.getCities().add(existingCity);
        }

        City updatedCity = cityRepository.save(existingCity);

        return dtoService.convertCityToDTO(updatedCity);
    }




    @Override
    public PagedResponse<CityDTO> getAllCities(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<City> pages = cityRepository.findAll(pageable);
        List<City> allCities = pages.getContent();
        List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);

        return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    @Override
    public PagedResponse<CityDTO> getAllActivatedCities(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<City> pages = cityRepository.findByIsActiveTrue(pageable);
        List<City> allCities = pages.getContent();
        List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);

        return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }
    
    
    
    @Override
    public PagedResponse<CityDTO> getAllInactivatedCities(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);

        Page<City> pages = cityRepository.findByIsActiveFalse(pageable);
        List<City> allCities = pages.getContent();
        List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);

        return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
    }


	@Override
	public CityDTO activateCity(Long id) {
		City existingCity = cityRepository.findById(id)
                .orElseThrow(() -> new UserException("City not found"));
		
		if (existingCity.getIsActive()) {
            throw new UserException("City is Already active");
        }

		existingCity.setIsActive(true);
		
		City updatedCity = cityRepository.save(existingCity);
        return dtoService.convertCityToDTO(updatedCity);
	}


	@Override
	public PagedResponse<CityDTO> getAllActivatedCitiesByStateId(int page, int size, String sortBy, String direction,
			Long id) {
		
		State state = stateRepository.findById(id).orElseThrow(()->new UserException("State not found"));
		
		if(!state.getIsActive()) {
			throw new UserException("State is not active");
		}
		Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
        
        Page<City> pages = cityRepository.findByIsActiveTrueAndState(state, pageable);
        List<City> allCities = pages.getContent();
        List<CityDTO> allCitiesDTO = dtoService.convertCityListEntityToDTO(allCities);

        return new PagedResponse<CityDTO>(allCitiesDTO, pages.getNumber(), pages.getSize(), pages.getTotalElements(), pages.getTotalPages(), pages.isLast());
	}


	@Override
	public CityDTO getCityById(Long id) {
		City existingCity = cityRepository.findById(id)
                .orElseThrow(() -> new UserException("City not found"));
		
		return dtoService.convertCityToDTO(existingCity);
	}


	@Override
	public List<CityDTO> getListOfAllActiveCitiesByState(String stateName) {
		State state = stateRepository.findByStateName(stateName).orElseThrow(()->new UserException("State not found"));
		
		if(!state.getIsActive()) {
			throw new UserException("State is not active");
		}
		
		List<City> cities = cityRepository.findByIsActiveTrueAndState(state);
		
		return dtoService.convertCityListEntityToDTO(cities);
	}
}
