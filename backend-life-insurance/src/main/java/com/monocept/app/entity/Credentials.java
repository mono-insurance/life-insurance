package com.monocept.app.entity;

import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "credentials")
public class Credentials {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="id")
	
	private Long id;
	
	@NotBlank
	@Column(name ="username",nullable = false, unique = true)
	private String username;
	
	@Email
	@Column(name ="email",nullable = false, unique = true)
	private String email;
	
	@NotBlank
	@Column(name ="password",nullable = false)
	private String password;

	
	@Pattern(regexp = "^\\+91[-\\s]?\\d{5}[-\\s]?\\d{5}$", message = "Mobile number must be in the format +91XXXXXXXXXX")
    @Column(name = "mobile_number", nullable = false, unique = true)
    private String mobileNumber;


	@OneToOne(mappedBy = "credentials", cascade = CascadeType.ALL, orphanRemoval = true)
	private Customer customer;
	
	@OneToOne(mappedBy = "credentials", cascade = CascadeType.ALL, orphanRemoval = true)
	private Admin admin;
	
	@OneToOne(mappedBy = "credentials", cascade = CascadeType.ALL, orphanRemoval = true)
	private Agent agent;
	
	@OneToOne(mappedBy = "credentials", cascade = CascadeType.ALL, orphanRemoval = true)
	private Employee employee;

	@ManyToOne(fetch = FetchType.LAZY)
	private Role role;
	
}
