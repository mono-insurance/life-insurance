package com.monocept.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LoginResponseDTO {

	private String accessToken;
	private String tokenType = "Bearer";
	private String role;
	private int id;
}
