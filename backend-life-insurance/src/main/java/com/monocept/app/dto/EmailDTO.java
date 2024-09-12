package com.monocept.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDTO {
    @Email
    @NotBlank(message = "email could not be null")
    private String emailId;
    @NotBlank(message = "title could not be null")
    private String title;
    @NotBlank(message = "body could not be null")
    private String body;
    @NotNull(message = "policyId could not be null")
    private Long policyId;
    @NotNull(message = "agentId could not be null")
    private Long agentId;
}
