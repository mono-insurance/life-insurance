package com.monocept.app.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.monocept.app.entity.Image;
import com.monocept.app.entity.Policy;
import com.monocept.app.repository.DocumentUploadedRepository;
import com.monocept.app.repository.ImageRepository;
import com.monocept.app.repository.PolicyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.NoSuchElementException;

@Service
@Slf4j
public class StorageServiceImp implements StorageService{
    private final DocumentUploadedRepository documentUploadedRepository;
    private final PolicyRepository policyRepository;
    private final ImageRepository imageRepository;

    @Value("${application.bucket.name}")
    private String bucketName;
    @Autowired
    private AmazonS3 s3Client;

    public StorageServiceImp(DocumentUploadedRepository documentUploadedRepository, PolicyRepository policyRepository,
                             ImageRepository imageRepository) {
        this.documentUploadedRepository = documentUploadedRepository;
        this.policyRepository = policyRepository;
        this.imageRepository = imageRepository;
    }

    @Override
    public Boolean addNewInsuranceImages(Long insuranceId, MultipartFile file) {
        File fileObj = convertMultiPartFileToFile(file);
        String fileName=uploadDocToS3(fileObj,file.getOriginalFilename());
        Image image=new Image();
        Policy policy=policyRepository.findById(insuranceId).orElseThrow(()->new NoSuchElementException("policy not found"));
        image.setPolicy(policy);
        image.setCloudImageName(fileName);
        image=imageRepository.save(image);
        policy.getImages().add(image);
        policyRepository.save(policy);
        return true;
    }
    
    
    @Override
    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
    

    private String uploadDocToS3(File fileObj, String fileName) {
        String newFileName = System.currentTimeMillis() + "_" + fileName;
        s3Client.putObject(new PutObjectRequest(bucketName, newFileName, fileObj));
        fileObj.delete();
        return newFileName;
    }

    
    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }
}
