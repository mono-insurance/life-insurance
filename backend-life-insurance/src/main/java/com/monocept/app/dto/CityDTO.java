package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CityDTO {
	
	private Long cityId;

    @NotBlank(message = "City name is mandatory")
    private String cityName;

    @NotNull(message = "Active Status is mandatory")
    private Boolean isActive;

    private Long stateId;

}
