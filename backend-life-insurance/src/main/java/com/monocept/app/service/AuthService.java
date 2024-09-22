package com.monocept.app.service;

import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.PasswordResetDTO;

public interface AuthService {

    String updatePassword(Long id, String password, String newPassword);

	JWTAuthResponse login(LoginDTO loginDto);

	boolean isAdmin(String token, int userId);

	boolean isEmployee(String token, int userId);

	boolean isAgent(String token, int userId);

	boolean isCustomer(String token, int userId);

    void changePasswordRequest(String userId);

	Boolean otpConfirmation(String otp, String userId);

	Boolean passwordReset(PasswordResetDTO passwordResetDTO);

	Long isCustomerId(String token);
}
