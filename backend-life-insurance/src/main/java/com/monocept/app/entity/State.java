package com.monocept.app.entity;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "state")
public class State {
	
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="state_id")
	private Long stateId;
	
	
	@NotBlank
	@Column(name ="state_name", unique = true)
	private String stateName;
	
	@NotNull
	@Column(name ="is_active")
	private Boolean isActive;
	
	@OneToMany(cascade = CascadeType.ALL ,mappedBy = "state", orphanRemoval = true)
	@JsonManagedReference
    private List<City> cities;


}
