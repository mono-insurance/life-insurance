package com.monocept.app.config;
import com.monocept.app.security.JwtAuthenticationEntryPoint;
import com.monocept.app.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private final JwtAuthenticationFilter authenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint,
                          JwtAuthenticationFilter authenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests((authorize) ->
                        authorize
//                                .requestMatchers(HttpMethod.POST, "/private/api/admin/**").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.GET, "/private/api/admin/**").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.DELETE, "/private/api/admin/**").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.PUT, "/private/api/admin/**").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.PATCH, "/private/api/admin/**").hasRole("ADMIN")
//
//                                .requestMatchers(HttpMethod.POST, "/private/api/customer/**").hasRole("CUSTOMER")
//                                .requestMatchers(HttpMethod.GET, "/private/api/customer/**").hasRole("CUSTOMER")
//                                .requestMatchers(HttpMethod.DELETE, "/private/api/customer/**").hasRole("ADMIN")
//                                .requestMatchers(HttpMethod.PUT, "/private/api/customer/**").hasRole("CUSTOMER")
//                                .requestMatchers(HttpMethod.PATCH, "/private/api/customer/**").hasRole("CUSTOMER")
                                .requestMatchers("/public/api/auth/**").permitAll()
                                .requestMatchers("/swagger-ui/**","/v3/api-docs").permitAll()
//                                .anyRequest().authenticated()
                                .anyRequest().permitAll()

                ).exceptionHandling( exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                ).sessionManagement( session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**");
    }
}
