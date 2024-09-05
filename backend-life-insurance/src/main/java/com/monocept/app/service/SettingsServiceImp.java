package com.monocept.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.entity.Admin;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Settings;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AdminRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.SettingsRepository;
import com.monocept.app.utils.GlobalSettings;

@Service
public class SettingsServiceImp implements SettingsService{
	
	@Autowired
    private SettingsRepository settingsRepository;
	
	@Autowired
	private DtoService dtoService;
	
	@Autowired 
	private AdminRepository adminRepository;
	
	@Autowired
    private AccessConService accessConService;
	
	@Override
	public SettingsDTO addOrUpdateSetting(SettingsDTO settingDTO) {
		
		CustomUserDetails userDetails = accessConService.checkUserAccess();

	    Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
	    
		Settings settings = dtoService.convertSettingsDtoToSettings(settingDTO);
	    
		Optional<Settings> existingSettingOpt = settingsRepository.findBySettingKey(settings.getSettingKey());
		
		if (existingSettingOpt.isPresent()) {
			
            Settings existingSetting = existingSettingOpt.get();
            existingSetting.setSettingValue(settings.getSettingValue());
            settings = settingsRepository.save(existingSetting);
        } else {
        	settings = settingsRepository.save(settings);
        }
		
		return dtoService.convertSettingsToSettingsDTO(settings);
	}

	@Override
	public SettingsDTO getSetting(String settingKey) {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
		
		GlobalSettings settingKeyExists = GlobalSettings.valueOf(settingKey);
	    Optional<Settings> settingOpt = settingsRepository.findBySettingKey(settingKeyExists);

	    Settings setting = settingOpt.orElseThrow(() -> new RuntimeException("Setting not found: " + settingKey));

	    return dtoService.convertSettingsToSettingsDTO(setting);
	}

	@Override
	public List<SettingsDTO> getAllSetting() {
		CustomUserDetails userDetails = accessConService.checkUserAccess();

		Admin admin = adminRepository.findById(userDetails.getId())
	            .orElseThrow(() -> new UserException("Admin not found"));
		
		List<Settings> allSettings = settingsRepository.findAll();
		
		List<SettingsDTO> allSettingsDTO = dtoService.convertSettingsListEntityToDTO(allSettings);
		
		return allSettingsDTO;

	}



}
