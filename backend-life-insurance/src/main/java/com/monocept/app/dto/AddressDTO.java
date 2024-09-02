package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
	
	private Long addressId;
    
    @NotBlank(message = "First street is mandatory")
    private String firstStreet;
    
    private String lastStreet;
    
    @NotBlank(message = "Pincode is mandatory")
    @Pattern(regexp = "\\d{6}", message = "Pincode must be exactly 6 digits")
    private String pincode;
    
    @NotBlank(message = "State is mandatory")
    private String state;
    
    @NotBlank(message = "City is mandatory")
    private String city;

}
