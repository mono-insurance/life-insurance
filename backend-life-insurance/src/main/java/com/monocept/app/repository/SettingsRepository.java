package com.monocept.app.repository;

import com.monocept.app.entity.Settings;
import com.monocept.app.utils.GlobalSettings;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {

	Optional<Settings> findBySettingKey(GlobalSettings settingKey);
}
