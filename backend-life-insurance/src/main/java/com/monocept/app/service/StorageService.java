package com.monocept.app.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    Boolean addNewInsuranceImages(Long insuranceId, MultipartFile file);

    byte[] downloadFile(String fileName);
}
