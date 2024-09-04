package com.monocept.app.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
	
    private Long feedbackId;
	
	@NotBlank(message="Title is mandatory")
    private String title;
	
	@Min(0)
	@Max(5)
	@NotNull(message="Rating is mandatory")
    private Integer rating;
	
	@Lob
	@NotBlank(message="description is mandatory")
	private String description;

    private Long customerId;

}
