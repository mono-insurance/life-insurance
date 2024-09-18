package com.monocept.app.controller;

import com.monocept.app.dto.DocumentNeededDTO;
import com.monocept.app.service.DocumentService;
import com.monocept.app.utils.PagedResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/suraksha/public")
public class PublicController {

    private final DocumentService documentService;

    public PublicController(DocumentService documentService) {
        this.documentService = documentService;
    }
    @GetMapping("/documents")
    ResponseEntity<PagedResponse<DocumentNeededDTO>> documentList(){
    PagedResponse<DocumentNeededDTO>documentNeededDTOPagedResponse=documentService.getAllDocumentName();
    return new ResponseEntity<>(documentNeededDTOPagedResponse, HttpStatus.OK);
    }

}
