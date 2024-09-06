package com.monocept.app.service;

import java.util.List;

import com.monocept.app.dto.SettingsDTO;


public interface SettingsService {

	SettingsDTO getSetting(String settingKey);

	SettingsDTO addOrUpdateSetting(SettingsDTO settingDTO);

	List<SettingsDTO> getAllSetting();

}
