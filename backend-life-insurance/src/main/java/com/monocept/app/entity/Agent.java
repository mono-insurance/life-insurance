package com.monocept.app.entity;

import java.time.LocalDate;
import java.util.List;

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
@Table(name = "agent")
public class Agent {

    @Id
    @Column(name ="agent_id")
    private Long agentId;
    
	@NotBlank
	@Column(name ="first_name")
	private String firstName;
	
	@Column(name ="last_name")
	private String lastName;
	
	@NotNull
	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;
	
	
	@NotBlank
	@Column(name ="qualification")
	private String qualification;
	
	@NotNull
	@Column(name ="is_active")
	private Boolean isActive;
	
	@NotNull
	@Column(name ="is_approved")
	private Boolean isApproved;
	
	
    @OneToOne
    @MapsId
    @JoinColumn(name="agent_id")
    private Credentials credentials;
    
    
	@OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name="address_id")
	private Address address;
	
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DocumentUploaded> documents;
	
    
    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PolicyAccount> policyAccounts;

	@OneToMany(mappedBy = "agent", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<WithdrawalRequests> withdrawalRequests;


}
