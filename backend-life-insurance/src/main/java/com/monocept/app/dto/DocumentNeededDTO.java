package com.monocept.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentNeededDTO {
	
	private Long documentId;

    @NotBlank(message = "Document name is mandatory")
    private String documentType;

}
