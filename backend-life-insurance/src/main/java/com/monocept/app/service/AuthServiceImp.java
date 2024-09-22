package com.monocept.app.service;

import com.monocept.app.dto.*;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Password;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AuthRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.repository.PasswordRepository;
import com.monocept.app.security.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

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
	private final PasswordRepository passwordRepository;


    public AuthServiceImp(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
						  EmailService emailService, AuthRepository authRepository,
						  CustomerRepository customerRepository, AccessConService accessConService, PasswordRepository passwordRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
        this.authRepository = authRepository;
        this.customerRepository = customerRepository;
        this.accessConService = accessConService;
		this.passwordRepository = passwordRepository;
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
	        if (credentials.getRole().getName().equals("ROLE_AGENT") && !credentials.getAgent().getIsActive()) {
	            throw new UserException("Your account is inactive. Please contact Admin to make it active.");
	        }
			if (credentials.getRole().getName().equals("ROLE_CUSTOMER") && !credentials.getCustomer().getIsActive()) {
				throw new UserException("Your account is inactive. Please contact Admin to make it active.");
			}
			if (credentials.getRole().getName().equals("ROLE_EMPLOYEE") && !credentials.getEmployee().getIsActive()) {
				throw new UserException("Your account is inactive. Please contact Admin to make it active.");
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
	public void changePasswordRequest(String userId) {
		Credentials credentials=authRepository.findByUsernameOrEmail(userId,userId).
				orElseThrow(()->new UserException("user not found of this email or username"));
		Password password=new Password();
		password.setCreatedAt(LocalDateTime.now());
		password.setUserNameOrEmail(credentials.getEmail());
		String otp=generateOTP();
		password.setOtp(otp);
		passwordRepository.save(password);
		EmailDTO emailDTO = new EmailDTO();
		emailDTO.setEmailId(credentials.getEmail());
		emailDTO.setTitle("Password Reset Request OTP");
		emailDTO.setBody("You have made request to update your password\n your otp is : "+otp+"\n this otp will expire after 5 minutes");
		emailService.sendAccountCreationEmail(emailDTO);
	}

	@Override
	public Boolean otpConfirmation(String otp, String userId) {
		Password password=passwordRepository.findByOtp(otp);
		if(!password.getOtp().equals(otp)) throw new UserException("wrong otp");
		if(!password.getUserNameOrEmail().equals(userId)) throw new UserException("wrong username");
		LocalDateTime passwordCreatedAt=password.getCreatedAt();
		Duration duration = Duration.between(passwordCreatedAt, LocalDateTime.now());
		boolean isMoreThan5Minutes = duration.toMinutes() > 5;
		if(isMoreThan5Minutes){
			throw new UserException("otp expired");
		}
		return true;
	}

	@Override
	public Boolean passwordReset(PasswordResetDTO passwordResetDTO) {
		Password password=passwordRepository.findByOtp(passwordResetDTO.getOtp());

		if(!password.getUserNameOrEmail().equals(passwordResetDTO.getUserNameOrEmail())){
			throw new UserException("invalid username or email not found");
		}
		if(!password.getOtp().equals(passwordResetDTO.getOtp())){
			throw new UserException("invalid otp not found");
		}
		LocalDateTime passwordCreatedAt=password.getCreatedAt();
		Duration duration = Duration.between(passwordCreatedAt, LocalDateTime.now());
		boolean isMoreThan5Minutes = duration.toMinutes() > 5;
		if(isMoreThan5Minutes){
			throw new UserException("otp expired");
		}
		Credentials credentials=authRepository.findByUsernameOrEmail
				(passwordResetDTO.getUserNameOrEmail(),passwordResetDTO.getUserNameOrEmail()).orElseThrow(()->new UserException("username not found"));
		String encriptedPassword = passwordEncoder.encode(passwordResetDTO.getNewPassword());
		System.out.println("new password is"+encriptedPassword);
		credentials.setPassword(encriptedPassword);
		authRepository.save(credentials);
		return true;

	}

	public static String generateOTP() {
		String numbers = "0123456789";
		SecureRandom random = new SecureRandom();
		StringBuilder otp = new StringBuilder(6);

		for (int i = 0; i < 6; i++) {
			int index = random.nextInt(numbers.length());
			otp.append(numbers.charAt(index));
		}

		return otp.toString();
	}
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
