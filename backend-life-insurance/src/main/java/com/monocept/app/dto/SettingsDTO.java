package com.monocept.app.dto;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettingsDTO {
	
	private Long settingId;

    @NotBlank(message = "Setting key is mandatory")
    private String settingKey;

    @NotNull(message = "Setting value is mandatory")
    @Min(value = 0, message = "Setting value must be at least 0")
    @Max(value = 100, message = "Setting value must be at most 100")
    private Float settingValue;

}
