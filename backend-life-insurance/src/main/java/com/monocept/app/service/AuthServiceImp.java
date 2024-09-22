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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImp implements AuthService{

	@Autowired
    private PasswordEncoder passwordEncoder;

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
		    if(credentials.getCustomer() != null) {
		    	if(!credentials.getCustomer().getIsActive()) {
		    		throw new UserException("Can't Login!. You are inactive");
		    	}
		    }
		    if(credentials.getAgent() != null) {
		    	if(!credentials.getCustomer().getIsActive()) {
		    		throw new UserException("Can't Login!. You are inactive");
		    	}
		    	else if(!credentials.getAgent().getIsApproved()) {
		    		throw new UserException("Can't Login!. Your profile is for under review. Login After verification");
		    	}
		    }
	        if(credentials.getEmployee() != null) {
	        	if(!credentials.getEmployee().getIsActive()) {
		    		throw new UserException("Can't Login!. You are inactive");
		    	}
	        }
	        
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
    public String updatePassword(Long id, String oldPassword, String newPassword) {
    	Credentials credentials = authRepository.findById(id).orElseThrow(()->new UserException("User not found"));
    	
    	if (!passwordEncoder.matches(oldPassword, credentials.getPassword())) {
            throw new RuntimeException("Old password does not match");  // Handle invalid old password error
        }
    	
    	String encodedNewPassword = passwordEncoder.encode(newPassword);
    	
    	credentials.setPassword(encodedNewPassword);
    	authRepository.save(credentials);
    	
    	return "Password Updated Successfully! Need to login again";
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
	    return "ROLE_EMPLOYEE".equals(role);
	}

	@Override
	public boolean isAgent(String token, int userId) {
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
	    return "ROLE_AGENT".equals(role);
	}

	@Override
	public boolean isCustomer(String token, int userId) {
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
	    return "ROLE_CUSTOMER".equals(role);
	}

	@Override
	public Long isCustomerId(String token) {
		Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
		
		Long tokenUserId = claims.get("id", Long.class);
		String role = claims.get("role", String.class);
	    System.out.println("Role: " + role);
	    if( "ROLE_CUSTOMER".equals(role)) {
	    	return tokenUserId;
	    }
	    else return 0L;
		
	}
}
