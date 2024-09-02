package com.monocept.app.service;

import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO loginUser(LoginDTO loginDTO);

    LoginResponseDTO updatePassword(String password);
}
