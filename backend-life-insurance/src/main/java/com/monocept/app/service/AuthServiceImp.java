package com.monocept.app.service;

import com.monocept.app.dto.JWTAuthResponse;
import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.entity.Credentials;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AuthRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.security.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImp implements AuthService{


    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;
    private EmailService emailService;
    private AuthRepository authRepository;
    private CustomerRepository customerRepository;
    private AccessConService accessConService;


    public AuthServiceImp(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                          EmailService emailService, AuthRepository authRepository,
                          CustomerRepository customerRepository, AccessConService accessConService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
        this.authRepository = authRepository;
        this.customerRepository = customerRepository;
        this.accessConService = accessConService;
    }

    @Value("${app.jwt-secret}")
    private String secretKey;
    
    
    @Override
    public JWTAuthResponse login(LoginDTO loginDto) {
    	try {
    		System.out.println(loginDto+"765");
	        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
	                loginDto.getUsernameOrEmail(), loginDto.getPassword()));
	
	        System.out.println(loginDto + "333");
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        
	        String usernameOrEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		    Credentials credentials = authRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
		            .orElseThrow(() -> new UserException("User not found with username or email: " + usernameOrEmail));
//	        if (user.getCustomer() != null && !user.getCustomer().isActive()) {
//	            throw new UserException("Your account is inactive. Please contact Admin to make it active.");
//	        }
	        
	        String token = jwtTokenProvider.generateToken(authentication);
	        
	        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
	        jwtAuthResponse.setAccessToken(token);
	        jwtAuthResponse.setId(credentials.getId());
	        if(credentials.getAdmin() != null) jwtAuthResponse.setRole("Admin");
	        if(credentials.getCustomer() != null) jwtAuthResponse.setRole("Customer");
	        if(credentials.getAgent() != null) jwtAuthResponse.setRole("Agent");
	        if(credentials.getEmployee() != null) jwtAuthResponse.setRole("Employee");
	
	        return jwtAuthResponse;
        }
    	catch (BadCredentialsException e) {
            throw new UserException("Invalid username or password.");
        } 
    	catch (UserException e) {
            throw new UserException(e.getMessage());
        } 
    	catch (Exception e) {
            throw new UserException("Login failed! Please try again later");
        }
    }

    @Override
    public LoginResponseDTO updatePassword(String password) {
//        CustomUserDetails userDetails=accessConService.checkUserAccess();
//        System.out.println("username in update password"+userDetails.getUsername());
//        Credentials credential=authRepository.findByUsername(userDetails.getUsername());
//
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        String encodedPassword = passwordEncoder.encode(password);
//
//        credential.setPassword(encodedPassword);
//        authRepository.save(credential);
//        LoginDTO loginDTO=new LoginDTO(String.valueOf(userDetails.getUsername()),password);
//        return loginUser(loginDTO);
    	return null;
    }

	@Override
	public boolean isAdmin(String token, int userId) {
		Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
		Integer tokenUserId = claims.get("id", Integer.class);
	    if (tokenUserId == null || !tokenUserId.equals(userId)) {
	        return false;
	    }
	    String role = claims.get("role", String.class);
	    System.out.println("Role: " + role);
	    return "ROLE_ADMIN".equals(role);
	}

	@Override
	public boolean isEmployee(String token, int userId) {
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
		
		Claims claims = Jwts.parserBuilder()
	            .setSigningKey(key)
	            .build()
                .parseClaimsJws(token)
                .getBody();
		Integer tokenUserId = claims.get("id", Integer.class);
	    if (tokenUserId == null || !tokenUserId.equals(userId)) {
	        return false;
	    }
	    String role = claims.get("role", String.class);
	    System.out.println("Role: " + role);
	    return "ROLE_EMPLOYEE".equals(role);
	}

	@Override
	public boolean isAgent(String token, int userId) {
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
		
		Claims claims = Jwts.parserBuilder()
	            .setSigningKey(key)
	            .build()
                .parseClaimsJws(token)
                .getBody();
		Integer tokenUserId = claims.get("id", Integer.class);
	    if (tokenUserId == null || !tokenUserId.equals(userId)) {
	        return false;
	    }
	    String role = claims.get("role", String.class);
	    System.out.println("Role: " + role);
	    return "ROLE_AGENT".equals(role);
	}

	@Override
	public boolean isCustomer(String token, int userId) {
		Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
		
		Claims claims = Jwts.parserBuilder()
	            .setSigningKey(key)
	            .build()
                .parseClaimsJws(token)
                .getBody();
		Integer tokenUserId = claims.get("id", Integer.class);
	    if (tokenUserId == null || !tokenUserId.equals(userId)) {
	        return false;
	    }
	    String role = claims.get("role", String.class);
	    System.out.println("Role: " + role);
	    return "ROLE_CUSTOMER".equals(role);
	}
}
