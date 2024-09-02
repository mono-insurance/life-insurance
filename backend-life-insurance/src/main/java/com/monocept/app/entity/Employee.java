package com.monocept.app.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "employee")
public class Employee {


	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
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
	
	
//	@OneToOne
//    @MapsId
//    @JoinColumn(name="employee_id")
//    private Credentials credentials;

}
