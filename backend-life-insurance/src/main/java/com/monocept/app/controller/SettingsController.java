package com.monocept.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.service.SettingsService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/suraksha/settings")
public class SettingsController {
	
	@Autowired
	private SettingsService settingsService;
	
    @Operation(summary = "By Admin: Add or Update Setting")
    @PutMapping("/settings/update")
    public ResponseEntity<SettingsDTO> addOrUpdateSetting(@RequestBody @Valid SettingsDTO settingDTO) {
        SettingsDTO updatedSetting = settingsService.addOrUpdateSetting(settingDTO);

        return new ResponseEntity<SettingsDTO>(updatedSetting, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get Settings By Key")
    @GetMapping("/settings/key")
    public ResponseEntity<SettingsDTO> getSetting(@RequestBody String settingKey) {
        SettingsDTO setting = settingsService.getSetting(settingKey);

        return new ResponseEntity<SettingsDTO>(setting, HttpStatus.OK);
    }
    
    
    @Operation(summary = "By Admin: Get All Settings")
    @GetMapping("/settings")
    public ResponseEntity<List<SettingsDTO>> getAllSetting() {
    	List<SettingsDTO> setting = settingsService.getAllSetting();

        return new ResponseEntity<List<SettingsDTO>>(setting, HttpStatus.OK);
    }





}
