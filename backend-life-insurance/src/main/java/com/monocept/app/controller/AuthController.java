package com.monocept.app.controller;

import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.AuthService;
import com.monocept.app.service.CustomerService;
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
    private AuthService authService;
    private CustomerService customerService;
    private final AgentService agentService;
    

    public AuthController(AuthService authService, CustomerService customerService, AgentService agentService) {
        this.authService = authService;
        this.customerService = customerService;
        this.agentService = agentService;
    }
    
    
    @PostMapping("/login")
    ResponseEntity<LoginResponseDTO>login(@RequestBody @Valid LoginDTO loginDTO){
        LoginResponseDTO loginResponseDTO=authService.loginUser(loginDTO);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
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
