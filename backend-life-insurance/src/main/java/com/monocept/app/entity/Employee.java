package com.monocept.app.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
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
@Table(name = "employee")
public class Employee {
	

    @Id
    @Column(name ="employee_id")
    private long employeeId;
    
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
	
	@Column(name ="is_active")
	private boolean isActive;
	
	
	@OneToOne
    @MapsId
    @JoinColumn(name="employee_id")
    private Credentials credentials;

}
