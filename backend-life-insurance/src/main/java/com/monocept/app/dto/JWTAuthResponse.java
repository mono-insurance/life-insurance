package com.monocept.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JWTAuthResponse {
	
	private String accessToken;
	private String tokenType = "Bearer";
	private String role;
	private Long id;

}
