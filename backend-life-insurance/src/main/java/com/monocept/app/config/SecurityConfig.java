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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
//@EnableMethodSecurity
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
                .cors(cors -> cors.and())
                .authorizeHttpRequests((authorize) ->
                        authorize
                        
                        		.requestMatchers("/suraksha/customer/card/token" , "/suraksha/customer/charge").permitAll()
                                .requestMatchers(HttpMethod.POST, "/suraksha/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/suraksha/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/admin/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/admin/**").hasRole("ADMIN")

                                .requestMatchers(HttpMethod.POST, "/suraksha/settings/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/suraksha/settings/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/settings/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/settings/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/settings/**").hasRole("ADMIN")
                                .requestMatchers("/suraksha/customer/customer/registration", "/suraksha/agent/agent/registration").permitAll()
                                .requestMatchers("/suraksha/insurancetype/all/active").permitAll()

                                .requestMatchers(HttpMethod.POST, "/suraksha/payment/**").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.GET, "/suraksha/payment/**").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/payment/**").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/payment/**").hasRole("CUSTOMER")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/payment/**").hasRole("CUSTOMER")

                                .requestMatchers(HttpMethod.POST, "/suraksha/customer/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.GET, "/suraksha/customer/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/customer/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/customer/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/customer/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")

                                .requestMatchers(HttpMethod.POST, "/suraksha/agent/**").
                                hasAnyRole("AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.GET, "/suraksha/agent/**").
                                hasAnyRole("AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/agent/**").
                                hasAnyRole("AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/agent/**").
                                hasAnyRole("AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/agent/**").
                                hasAnyRole("AGENT","EMPLOYEE","ADMIN")

                                .requestMatchers(HttpMethod.POST, "/suraksha/employee/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.GET, "/suraksha/employee/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/suraksha/employee/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/employee/**").
                                hasAnyRole("CUSTOMER","AGENT","EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PATCH, "/suraksha/employee/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers("/suraksha/state/all/active", "/suraksha/city/all/active/state/**").permitAll()

                                .requestMatchers(HttpMethod.PUT, "/suraksha/state/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/city/**").
                                hasAnyRole("EMPLOYEE","ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/suraksha/download/**").
                                hasAnyRole("ADMIN","CUSTOMER","AGENT","EMPLOYEE")

                                .requestMatchers("/public/api/auth/**").permitAll()
                                .requestMatchers("/swagger-ui/**","/v3/api-docs").permitAll()
                                .requestMatchers("/suraksha/policy/policy/{pid}" , "/suraksha/policy/all/**", "/suraksha/policy/download/policy-image/{pid}").permitAll()
                                .requestMatchers("/suraksha/insurancetype/all/**").permitAll()
                                

                                .anyRequest().authenticated()


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

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .exposedHeaders("Authorization");
            }
        };
    }
}
