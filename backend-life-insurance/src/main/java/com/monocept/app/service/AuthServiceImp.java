package com.monocept.app.service;

import com.monocept.app.dto.LoginDTO;
import com.monocept.app.dto.LoginResponseDTO;
import com.monocept.app.entity.Credentials;
import com.monocept.app.entity.Customer;
import com.monocept.app.repository.AuthRepository;
import com.monocept.app.repository.CustomerRepository;
import com.monocept.app.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

@Service
public class AuthServiceImp implements AuthService{


    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final AuthRepository authRepository;
    private final CustomerRepository customerRepository;
    private final AccessConService accessConService;


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

    @Override
    public LoginResponseDTO loginUser(LoginDTO loginDto) {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDto.getUsername(), loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.generateToken(authentication);
            return new LoginResponseDTO(Integer.parseInt(loginDto.getUsername()),token);
        }
        catch(Exception e){
            throw new NoSuchElementException("wrong username or password");
        }
    }

    @Override
    public LoginResponseDTO updatePassword(String password) {
        String usernameFromToken=accessConService.checkUserAccess();
        System.out.println("username in update password"+usernameFromToken);
        Credentials credential=authRepository.findByUsername(usernameFromToken);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);

        credential.setPassword(encodedPassword);
        authRepository.save(credential);
        LoginDTO loginDTO=new LoginDTO(String.valueOf(usernameFromToken),password);
        return loginUser(loginDTO);
    }
}
