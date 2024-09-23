package com.monocept.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "password")
public class Password {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_name_or_email")
    private String userNameOrEmail;

    @Column(name = "otp", nullable = false)
    private String otp;

    @Column(name = "created_at",nullable = false)
    private LocalDateTime createdAt;
}
