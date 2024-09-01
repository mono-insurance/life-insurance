package com.monocept.app.entity;

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
	private long stateId;
	
	
	@NotBlank
	@Column(name ="state_name")
	private String stateName;
	
	
	@Column(name ="is_active")
	private boolean isActive;
	
	@OneToMany(cascade = {CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH},mappedBy = "state")
	@JsonManagedReference
    private Set<City> cities;

}
