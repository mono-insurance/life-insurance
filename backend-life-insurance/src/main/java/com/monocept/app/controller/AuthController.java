package com.monocept.app.controller;

import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("public/api/auth")
public class AuthController {
    @Autowired
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
    ResponseEntity<LoginResponseDTO>login(@RequestBody @Valid LoginDTO loginDTO){
        LoginResponseDTO loginResponseDTO=authService.loginUser(loginDTO);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
    }
    @PostMapping("/update-password")
    ResponseEntity<LoginResponseDTO> updatePassword(@RequestBody String password) {
        LoginResponseDTO loginResponseDTO = authService.updatePassword(password);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
    }

}
