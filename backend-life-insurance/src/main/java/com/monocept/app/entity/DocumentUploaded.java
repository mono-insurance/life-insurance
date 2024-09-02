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
@Table(name = "document_uploaded")
public class DocumentUploaded {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;

	@NotBlank(message = "Blob Id is mandatory")
    @Column(name = "blob_id")
    private String blobId;

    @NotBlank
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "is_approved")
    private Boolean isApproved;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Agent agent;
    
    @OneToOne(mappedBy = "documentUploaded")
    private Policy policy;
    
}
