package com.monocept.app.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StateDTO {
	
	private Long stateId;

    @NotBlank(message = "State name is mandatory")
    private String stateName;

    @NotNull(message = "Active status is mandatory")
    private Boolean isActive;

    private Set<CityDTO> cities;

}
