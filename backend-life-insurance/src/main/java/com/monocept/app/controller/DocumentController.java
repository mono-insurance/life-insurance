package com.monocept.app.controller;

import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.service.StorageService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/document")
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
    @PostMapping("/upload")
    ResponseEntity<Boolean> addUserDocument(
            @RequestBody @Valid DocumentUploadedDTO documentUploadedDTO,
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

}
