package com.monocept.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetDTO {
    @NotBlank(message = "otp could not be null")
    @Positive
    private String otp;
    @NotBlank(message = "userName could not be null")
    private String userNameOrEmail;
    @NotBlank(message = "newPassword could not be null")
    private String newPassword;
}
