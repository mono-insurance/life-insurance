package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.dto.RegistrationDTO;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.AuthService;
import com.monocept.app.service.CustomerService;

import com.monocept.app.service.StateService;
import com.monocept.app.utils.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    private final AgentService agentService;
    private final CustomerService customerService;
    private final StateService stateService;


    public AuthController(AuthService authService, AgentService agentService, CustomerService customerService, StateService stateService) {
        this.authService = authService;
        this.agentService = agentService;
        this.customerService = customerService;
        this.stateService = stateService;
    }


    @Operation(summary = "By Anyone: Login the user or admin if have registered and if active")
    @PostMapping(value = {"/login"})
    public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDTO loginDto) {
        System.out.println(loginDto);
        JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
        System.out.println(loginDto);

        String token = jwtAuthResponse.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);


        JWTAuthResponse responseBody = new JWTAuthResponse();
        responseBody.setTokenType(jwtAuthResponse.getTokenType());
        responseBody.setRole(jwtAuthResponse.getRole());
        responseBody.setId(jwtAuthResponse.getId());
        responseBody.setAccessToken(jwtAuthResponse.getAccessToken());
        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
    }

    @PostMapping("/register-customer")
    ResponseEntity<Long> customerRegistration(@RequestBody @Valid RegistrationDTO registrationDTO) {

        Long id = customerService.customerRegistration(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @Operation(summary = "By Admin and Employee: Get All States")
    @GetMapping("/all-states")
    public ResponseEntity<PagedResponse<StateDTO>> getAllStates(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "stateName") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        PagedResponse<StateDTO> states = stateService.getAllStates(page, size, sortBy, direction);

        return new ResponseEntity<>(states, HttpStatus.OK);

    }


    @PostMapping("/register-agent")
    ResponseEntity<Long> agentRegisterRequest(@RequestBody @Valid CredentialsDTO credentialsDTO) {
        Long id = agentService.agentRegisterRequest(credentialsDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @Operation(summary = "By Anyone: Verify Admin")
    @GetMapping(value = {"/verify/admin/{userId}"})
    public ResponseEntity<Boolean> isAdmin(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
        System.out.println("Received Token: " + token);

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean adminOrNot = authService.isAdmin(token, userId);
        System.out.println(adminOrNot);

        return ResponseEntity.ok(adminOrNot);
    }


    @Operation(summary = "By Anyone: Verify Employee")
    @GetMapping(value = {"/verify/employee/{userId}"})
    public ResponseEntity<Boolean> isEmployee(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
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
    public ResponseEntity<Boolean> isAgent(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
        System.out.println("Received Token: " + token);

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean agentOrNot = authService.isAgent(token, userId);
        System.out.println(agentOrNot);

        return ResponseEntity.ok(agentOrNot);
    }


    @Operation(summary = "By Anyone: Verify Customer")
    @GetMapping(value = {"/verify/customer/{userId}"})
    public ResponseEntity<Boolean> isCustomer(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
        System.out.println("Received Token: " + token);

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean customerOrNot = authService.isCustomer(token, userId);
        System.out.println(customerOrNot);

        return ResponseEntity.ok(customerOrNot);
    }


    @PostMapping("/update-password")
    ResponseEntity<LoginResponseDTO> updatePassword(@RequestBody String password) {
        LoginResponseDTO loginResponseDTO = authService.updatePassword(password);
        return new ResponseEntity<>(loginResponseDTO, HttpStatus.OK);
    }
}
