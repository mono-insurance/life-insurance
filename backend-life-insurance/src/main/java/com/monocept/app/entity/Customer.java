package com.monocept.app.entity;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
    private long customerId;
    
	@NotBlank
	@Column(name ="first_name")
	private String firstName;
	
	@Column(name ="last_name")
	private String lastName;
	
	@NotNull
	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;
	
	@NotBlank
	@Column(name ="gender")
	private String gender;
	
	@Column(name ="is_active")
	private boolean isActive;

	@NotBlank
	@Column(name ="nominee_name")
	private String nomineeName;
	
	@NotBlank
	@Column(name ="nominee_relation")
	private String nomineeRelation;
	
	
	@Column(name ="is_approved")
	private boolean isApproved;
	
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
