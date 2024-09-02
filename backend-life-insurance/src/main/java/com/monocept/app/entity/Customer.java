package com.monocept.app.entity;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "customers")
public class Customer {
	
	
    @Id
    @Column(name ="customer_id")
    private Long customerId;
    
	@NotBlank
	@Column(name ="first_name")
	private String firstName;
	
	@Column(name ="last_name")
	private String lastName;
	
	@NotNull
	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;
	
	@NotBlank
	@Enumerated(EnumType.STRING)
	@Column(name ="gender")
	private GenderType gender;
	
	@NotNull
	@Column(name ="is_active")
	private Boolean isActive;

	@NotBlank
	@Column(name ="nominee_name")
	private String nomineeName;
	
	@NotBlank
	@Enumerated(EnumType.STRING)
	@Column(name ="nominee_relation")
	private NomineeRelation nomineeRelation;
	
	@NotNull
	@Column(name ="is_approved")
	private Boolean isApproved;
	
	@OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name="address_id")
	private Address address;
	
    @OneToOne
    @MapsId
    @JoinColumn(name="customer_id")
    private Credentials credentials;
    
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<DocumentUploaded> documents;
    
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<PolicyAccount> policyAccounts;
    
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Query> queries;
}