package com.monocept.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "city")
public class City {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="city_id")
	private long cityId;
	

	@NotBlank
	@Column(name ="city_name")
	private String cityName;
	
	
	@Column(name ="is_active")
	private boolean isActive;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
	@JsonBackReference
    private State state;
}
