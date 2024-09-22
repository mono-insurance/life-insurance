package com.monocept.app.security;

import com.monocept.app.entity.Credentials;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.AuthRepository;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app-jwt-expiration-milliseconds}")
    private long jwtExpirationDate;
    
    @Autowired
    private AuthRepository authRepository;

    // generate JWT token
    public String generateToken(Authentication authentication){
        String username = authentication.getName();

        Credentials credentials =  authRepository.findByUsernameOrEmail(username, username)
        		.orElseThrow(() -> new UserException("User not found with username or email: " + username));
        
        
        Date currentDate = new Date();

        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        String token = Jwts.builder()
                .setSubject(username)
                .claim("role", credentials.getRole().getName())
                .claim("id", credentials.getId())
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(key())
                .compact();
        return token;
    }

    private Key key(){
        return Keys.hmacShaKeyFor(
                Decoders.BASE64.decode(jwtSecret)
        );
    }

    // get username from Jwt token
    public String getUsername(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        String username = claims.getSubject();
        return username;
    }

    // validate Jwt token
    public boolean validateToken(String token){
        System.out.println("Token is: '" + token + "'");

        try{
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parse(token);
            return true;
        } catch (MalformedJwtException ex) {
            throw new RoleAccessException("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            throw new RoleAccessException("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            throw new RoleAccessException("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            throw new RoleAccessException("JWT claims string is empty.");
        }
    }
}
