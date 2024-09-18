package com.monocept.app.service;

import com.monocept.app.dto.DocumentNeededDTO;
import com.monocept.app.entity.DocumentNeeded;
import com.monocept.app.repository.DocumentNeededRepository;
import com.monocept.app.utils.DocumentType;
import com.monocept.app.utils.PagedResponse;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentServiceImp implements DocumentService{
    private final DocumentNeededRepository documentNeededRepository;

    public DocumentServiceImp(DocumentNeededRepository documentNeededRepository) {
        this.documentNeededRepository = documentNeededRepository;
    }

    @Override
    public PagedResponse<DocumentNeededDTO> getAllDocumentName() {
        List<DocumentNeededDTO> documentNames = Arrays.stream(DocumentType.values()).
                map(docType -> new DocumentNeededDTO(0L,docType.name())) // Convert enum to DTO
                .collect(Collectors.toList());
        return new PagedResponse<>(documentNames,0,documentNames.size(),
                Long.valueOf(documentNames.size()), 1, true);
    }
}
