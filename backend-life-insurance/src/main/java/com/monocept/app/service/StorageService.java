package com.monocept.app.service;

import com.monocept.app.dto.DocumentUploadedDTO;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    Boolean addNewInsuranceImages(Long insuranceId, MultipartFile file);

    byte[] downloadFile(Long documentId);

    Boolean addUserDocuments(DocumentUploadedDTO agentId, MultipartFile file);

    Boolean deleteDocument(Long documentId);

    Boolean deletePolicyImage(Long imageId);

    byte[] downloadPolicyImage(Long pid);

	byte[] updatePolicyImage(Long pid, MultipartFile file);
}
