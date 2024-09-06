package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.AuthService;
import com.monocept.app.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
        Long id = customerService.customerRegistrationRequest(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    
    
    @PostMapping("/agent-register")
    ResponseEntity<Long> agentRegisterRequest(@RequestBody @Valid CredentialsDTO credentialsDTO) {
        Long id = agentService.agentRegisterRequest(credentialsDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    
    @Operation(summary = "By Anyone: Verify Admin")
    @GetMapping(value = {"/verify/admin/{userId}"})
    public ResponseEntity<Boolean> isAdmin(@PathVariable(name = "userId")int userId, @RequestHeader("Authorization") String token){
    	System.out.println("Received Token: " + token);
    	
    	if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    	
    	boolean adminOrNot = authService.isAdmin(token , userId);
        System.out.println(adminOrNot);

        return ResponseEntity.ok(adminOrNot);
    }
    
    
    @Operation(summary = "By Anyone: Verify Employee")
    @GetMapping(value = {"/verify/employee/{userId}"})
    public ResponseEntity<Boolean> isEmployee(@PathVariable(name = "userId")int userId, @RequestHeader("Authorization") String token){
    	System.out.println("Received Token: " + token);
    	
    	if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    	boolean employeeOrNot = authService.isEmployee(token, userId);
        System.out.println(employeeOrNot);

        return ResponseEntity.ok(employeeOrNot);
    }
    
    @Operation(summary = "By Anyone: Verify Agent")
    @GetMapping(value = {"/verify/agent/{userId}"})
    public ResponseEntity<Boolean> isAgent(@PathVariable(name = "userId")int userId, @RequestHeader("Authorization") String token){
    	System.out.println("Received Token: " + token);
    	
    	if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    	
    	boolean agentOrNot = authService.isAgent(token , userId);
        System.out.println(agentOrNot);

        return ResponseEntity.ok(agentOrNot);
    }
    
    
    @Operation(summary = "By Anyone: Verify Customer")
    @GetMapping(value = {"/verify/customer/{userId}"})
    public ResponseEntity<Boolean> isCustomer(@PathVariable(name = "userId")int userId, @RequestHeader("Authorization") String token){
    	System.out.println("Received Token: " + token);
    	
    	if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    	boolean customerOrNot = authService.isCustomer(token, userId);
        System.out.println(customerOrNot);

        return ResponseEntity.ok(customerOrNot);
    }
}
