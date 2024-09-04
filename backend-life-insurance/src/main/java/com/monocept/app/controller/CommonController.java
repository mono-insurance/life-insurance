package com.monocept.app.controller;

import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/common")
public class CommonController {

    private final AuthService authService;

    public CommonController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/update-password")
    ResponseEntity<LoginResponseDTO> updatePassword(@RequestBody String password) {
        LoginResponseDTO loginResponseDTO = authService.updatePassword(password);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
    }
}
