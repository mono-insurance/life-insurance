package com.monocept.app.entity;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "insurance_type")
public class InsuranceType {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="type_id")
	private Long typeId;
	
	
	@NotBlank
	@Column(name ="insurance_category")
	private String insuranceCategory;
	
	@NotNull
	@Column(name ="is_active")
	private Boolean isActive;
	
	
	@OneToMany(mappedBy = "insuranceType", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	@JsonManagedReference
	private Set<Policy> policies;
	
}
