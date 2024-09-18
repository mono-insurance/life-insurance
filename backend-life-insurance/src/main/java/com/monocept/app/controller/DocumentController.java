package com.monocept.app.controller;

import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.service.StorageService;
import com.monocept.app.utils.DocumentType;

import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/suraksha/document")
public class DocumentController {
    private final StorageService storageService;

    public DocumentController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/download/{did}")
    public ResponseEntity<ByteArrayResource> downloadFile(
            @PathVariable("did") Long documentId) {
        byte[] data = storageService.downloadFile(documentId);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + "testfile" + "\"")
                .body(resource);
    }
    
    
    @GetMapping(value="/upload",consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    ResponseEntity<Boolean> addUserDocument(
            @ModelAttribute @Valid DocumentUploadedDTO documentUploadedDTO,
            @RequestParam("file") MultipartFile file) {
        Boolean isAdded = storageService.addUserDocuments(documentUploadedDTO, file);
        return new ResponseEntity<>(isAdded, HttpStatus.OK);
    }
    

    @DeleteMapping("/{did}")
    ResponseEntity<Boolean> deleteDocument(@PathVariable("did")Long documentId) {
        Boolean isDeleted = storageService.deleteDocument(documentId);
        return new ResponseEntity<>(isDeleted, HttpStatus.OK);
    }
    
    
    @DeleteMapping("image/{eid}")
    ResponseEntity<Boolean> deletePolicyImage(@PathVariable("eid")Long imageId) {
        Boolean isDeleted = storageService.deletePolicyImage(imageId);
        return new ResponseEntity<>(isDeleted, HttpStatus.OK);
    }
    
    
    @GetMapping("/all")
    public List<String> getDocumentTypes() {
        return List.of(DocumentType.values())
                   .stream()
                   .map(DocumentType::name)
                   .collect(Collectors.toList());
    }

}
