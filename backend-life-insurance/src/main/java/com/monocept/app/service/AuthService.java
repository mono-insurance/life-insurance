package com.monocept.app.service;

import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;

public interface AuthService {

    String updatePassword(Long id, String password, String newPassword);

	JWTAuthResponse login(LoginDTO loginDto);

	boolean isAdmin(String token, int userId);

	boolean isEmployee(String token, int userId);

	boolean isAgent(String token, int userId);

	boolean isCustomer(String token, int userId);

	Long isCustomerId(String token);
}
