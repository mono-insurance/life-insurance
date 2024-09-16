package com.monocept.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.CityDTO;
import com.monocept.app.service.CityService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha/city")
public class CityController {
	
	@Autowired
	private CityService cityService;
	
	
	@Operation(summary = "By Admin and Employee: get City by id")
    @GetMapping("/{id}")
    public ResponseEntity<CityDTO> getCityById(@PathVariable(name = "id") Long id) {

		CityDTO city = cityService.getCityById(id);

        return new ResponseEntity<>(city, HttpStatus.OK);
    }

	

    @Operation(summary = "By Admin and Employee: update City")
    @PutMapping("/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable(name = "id") Long id, @RequestBody @Valid CityDTO cityDTO) {

        CityDTO city = cityService.updateCity(id, cityDTO);

        return new ResponseEntity<>(city, HttpStatus.OK);

    }
    
    @Operation(summary = "By Admin and Employee: Activate City")
    @PutMapping("/activate/{id}")
    public ResponseEntity<CityDTO> activateCity(@PathVariable(name = "id") Long id) {

        CityDTO city = cityService.activateCity(id);

        return new ResponseEntity<>(city, HttpStatus.OK);

    }


    @Operation(summary = "By Admin and Employee: Get All Cities")
    @GetMapping("")
    public ResponseEntity<PagedResponse<CityDTO>> getAllCities(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<CityDTO> cities = cityService.getAllCities(page, size, sortBy, direction);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By All: Get All Activated Cities")
    @GetMapping("/activated")
    public ResponseEntity<PagedResponse<CityDTO>> getAllActivatedCities(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<CityDTO> cities = cityService.getAllActivatedCities(page, size, sortBy, direction);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin and Employee: Get All Inactivated Cities")
    @GetMapping("/inactivated")
    public ResponseEntity<PagedResponse<CityDTO>> getAllInactivatedCities(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<CityDTO> cities = cityService.getAllInactivatedCities(page, size, sortBy, direction);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By Admin and Employee: Get All Activated Cities by State Id")
    @GetMapping("/activated/state/{id}")
    public ResponseEntity<PagedResponse<CityDTO>> getAllActivatedCitiesByStateId(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size, @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy, @RequestParam(name = "direction", defaultValue = "asc") String direction, @PathVariable(name = "id") Long id) {

        PagedResponse<CityDTO> cities = cityService.getAllActivatedCitiesByStateId(page, size, sortBy, direction, id);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }
    
    
    @Operation(summary = "By All: Get All Activated Cities by State Id")
    @GetMapping("/all/active/state")
    public ResponseEntity<List<CityDTO>> getListOfAllActiveCitiesByState(@RequestParam String stateName) {

    	List<CityDTO> cities = cityService.getListOfAllActiveCitiesByState(stateName);

        return new ResponseEntity<>(cities, HttpStatus.OK);

    }

}
