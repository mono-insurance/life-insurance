package com.monocept.app.controller;

import com.monocept.app.dto.CustomerDTO;
import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.service.AgentService;
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
    private final AgentService agentService;
    

    public AuthController(AuthService authService, CustomerService customerService, AgentService agentService) {
        this.authService = authService;
        this.customerService = customerService;
        this.agentService = agentService;
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
    

    @PostMapping("/customer-register")
    ResponseEntity<Long> customerRegisterRequest(@RequestBody @Valid RegistrationDTO registrationDTO) {
        Long id = customerService.customerRegisterRequest(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    @PostMapping("/agent-register")
    ResponseEntity<Long> agentRegisterRequest(@RequestBody @Valid RegistrationDTO registrationDTO) {
        Long id = agentService.agentRegisterRequest(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
