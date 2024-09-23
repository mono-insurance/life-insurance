package com.monocept.app.controller;

import com.monocept.app.dto.*;
import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.service.AgentService;
import com.monocept.app.service.AuthService;
import com.monocept.app.service.CustomerService;
import com.monocept.app.service.*;

import com.monocept.app.utils.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import java.util.Map;

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
import org.springframework.web.bind.annotation.*;


//}
//        <<<<<<< HEAD
//
//@Autowired
//private AuthService authService;
//private final AgentService agentService;
//
//@Autowired
//private CustomerService customerService;
//
//
//public AuthController(AuthService authService, AgentService agentService) {
//        this.authService = authService;
//        this.agentService = agentService;
//        }
//
//
//@Operation(summary = "By Anyone: Login the user or admin if have registered and if active")
//@PostMapping(value = {"/login"})
//public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDTO loginDto){
//        System.out.println(loginDto);
//        JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
//        =======

@RestController
@RequestMapping("/public/api/auth")
public class AuthController {


    @Autowired
    private AuthService authService;
    private  AgentService agentService;
    private  CustomerService customerService;
    private  StateService stateService;
    private  EmailService emailService;


    public AuthController(AuthService authService, AgentService agentService, CustomerService customerService,
                          StateService stateService, EmailService emailService) {
        this.authService = authService;
        this.agentService = agentService;
        this.customerService = customerService;
        this.stateService = stateService;
        this.emailService = emailService;
    }


    @Operation(summary = "By Anyone: Login the user or admin if have registered and if active")
    @PostMapping(value = {"/login"})
    public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDTO loginDto) {
        System.out.println(loginDto);
        JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
//>>>>>>> target6/master
        System.out.println(loginDto);

        String token = jwtAuthResponse.getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);


        JWTAuthResponse responseBody = new JWTAuthResponse();
        responseBody.setTokenType(jwtAuthResponse.getTokenType());
        responseBody.setRole(jwtAuthResponse.getRole());
        responseBody.setId(jwtAuthResponse.getId());
//<<<<<<< HEAD

        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
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

    @PostMapping("/register-customer")
    ResponseEntity<Long> customerRegistration(@RequestBody @Valid RegistrationDTO registrationDTO) {

        Long id = customerService.customerRegistration(registrationDTO);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
    @PostMapping("/contact-us")
    ResponseEntity<HttpStatus> ContactUs(@RequestBody @Valid EmailDTO emailDTO) {

        emailService.sendAccountCreationEmail(emailDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @PostMapping("/change-password-request/{userId}")
    ResponseEntity<HttpStatus> changePasswordRequest(@PathVariable("userId")String userId) {

        authService.changePasswordRequest(userId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @PostMapping("/otp-confirmation/{userId}/{otp}")
    ResponseEntity<Boolean> otpConfirmation(@PathVariable("userId")String userId,@PathVariable("otp")String otp) {

        Boolean isTrue=authService.otpConfirmation(otp,userId);
        return new ResponseEntity<>(isTrue,HttpStatus.OK);
    }
    @PostMapping("/password-reset")
    ResponseEntity<Boolean> passwordReset(@RequestBody @Valid PasswordResetDTO passwordResetDTO) {

        Boolean isSuccess=authService.passwordReset(passwordResetDTO);
        return new ResponseEntity<>(isSuccess,HttpStatus.OK);
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






    @Operation(summary = "By Anyone: Verify Employee")
    @GetMapping(value = {"/verify/employee/{userId}"})
    public ResponseEntity<Boolean> isEmployee(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
        System.out.println("Received Token: " + token);

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        boolean employeeOrNot = authService.isEmployee(token, userId);
//>>>>>>> target6/master
        System.out.println(employeeOrNot);

        return ResponseEntity.ok(employeeOrNot);
    }
//<<<<<<< HEAD


    @Operation(summary = "By Anyone: Verify Agent")
    @GetMapping(value = {"/verify/agent/{userId}"})
    public ResponseEntity<Boolean> isAgent(@PathVariable(name = "userId") int userId, @RequestHeader("Authorization") String token) {
        System.out.println("Received Token: " + token);

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        boolean agentOrNot = authService.isAgent(token, userId);
//>>>>>>> target6/master
        System.out.println(agentOrNot);

        return ResponseEntity.ok(agentOrNot);
    }
//<<<<<<< HEAD



    @Operation(summary = "By Anyone: Verify Customer")
    @GetMapping(value = {"/verify/customer"})
    public ResponseEntity<CustomerCreationDTO> isCustomerId(@RequestHeader("Authorization") String token){
    	System.out.println("Received Token: " + token);
    	
    	if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
    	Long customerOrNot = authService.isCustomerId(token);
        System.out.println(customerOrNot);
        
        if(customerOrNot != 0L) {
        	CustomerCreationDTO customer = customerService.getCustomerFullProfile(customerOrNot);
        	return ResponseEntity.ok(customer);
        }
        return ResponseEntity.ok(null);
    }
    
    @PostMapping("/update-password")
    ResponseEntity<String> updatePassword(@RequestBody Map<String, String> request) {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        Long id = Long.parseLong(request.get("id"));  // Assuming `id` is of type Long
        
        String str = authService.updatePassword(id, oldPassword, newPassword);
        return new ResponseEntity<>(str, HttpStatus.OK);
    }
}
