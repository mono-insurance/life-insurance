package com.monocept.app.controller;

import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.service.AuthService;
import com.monocept.app.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
    @Autowired
    private AuthService authService;
    private CustomerService customerService;
    

    public AuthController(AuthService authService, CustomerService customerService) {
        this.authService = authService;
        this.customerService = customerService;
    }
    
    
    @Operation(summary = "By Anyone: Login the user or admin if have registered and if active")
    @PostMapping(value = {"/login"})
    public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDTO loginDto){
    	JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
        System.out.println(loginDto);

        String token = jwtAuthResponse.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);


        JWTAuthResponse responseBody = new JWTAuthResponse();
        responseBody.setTokenType(jwtAuthResponse.getTokenType());
        responseBody.setRole(jwtAuthResponse.getRole());
        responseBody.setId(jwtAuthResponse.getId());

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }
    
    
    @PostMapping("/update-password")
    ResponseEntity<LoginResponseDTO> updatePassword(@RequestBody String password) {
        LoginResponseDTO loginResponseDTO = authService.updatePassword(password);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
    }
//    @PostMapping("/register")
//    ResponseEntity<Long> customerRegisterRequest(@RequestBody @Valid CustomerDTO customerDTO) {
//        Long id = customerService.customerRegisterRequest(customerDTO);
//        return new ResponseEntity<>(id, HttpStatus.OK);
//    }

}
