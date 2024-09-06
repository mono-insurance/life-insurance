package com.monocept.app.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.entity.*;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.repository.*;
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
    private final AgentRepository agentRepository;
    private final CustomerRepository customerRepository;

    @Value("${application.bucket.name}")
    private String bucketName;
    @Autowired
    private AmazonS3 s3Client;
    private final AccessConService accessConService;

    public StorageServiceImp(DocumentUploadedRepository documentUploadedRepository, PolicyRepository policyRepository,
                             ImageRepository imageRepository, AgentRepository agentRepository, CustomerRepository customerRepository,
                             AccessConService accessConService) {
        this.documentUploadedRepository = documentUploadedRepository;
        this.policyRepository = policyRepository;
        this.imageRepository = imageRepository;
        this.agentRepository = agentRepository;
        this.customerRepository = customerRepository;
        this.accessConService = accessConService;
    }

    @Override
    public Boolean addNewInsuranceImages(Long insuranceId, MultipartFile file) {
        accessConService.checkAdminAccess();
        File fileObj = convertMultiPartFileToFile(file);
        String newFileName = System.currentTimeMillis() + "_" +insuranceId;
        uploadDocToS3(fileObj,newFileName);
        Image image=new Image();
        Policy policy=policyRepository.findById(insuranceId).orElseThrow(()->new NoSuchElementException("policy not found"));
        image.setPolicy(policy);
        image.setCloudImageName(newFileName);
        image=imageRepository.save(image);
        policy.getImages().add(image);
        policyRepository.save(policy);
        return true;
    }
    
    @Override
    public byte[] downloadFile(Long documentId) {
        accessConService.checkDocumentAccess(documentId);

        DocumentUploaded documentUploaded=findDocumentById(documentId);
        String fileName=documentUploaded.getName();
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




    @Override
    public Boolean addUserDocuments( DocumentUploadedDTO documentUploadedDTO, MultipartFile file) {
        File fileObj = convertMultiPartFileToFile(file);
        String newFileName=System.currentTimeMillis() + "_" + documentUploadedDTO.getName();
        uploadDocToS3(fileObj,file.getOriginalFilename());
        DocumentUploaded documentUploaded=new DocumentUploaded();
        documentUploaded.setIsApproved(false);
        documentUploaded.setName(documentUploadedDTO.getName());
        documentUploaded.setCloudFileName(newFileName);
        mapWithUser(documentUploaded,documentUploadedDTO);
        return true;
    }

    @Override
    public Boolean deleteDocument(Long documentId) {
        accessConService.checkDocumentDeleteAccess(documentId);
        DocumentUploaded documentUploaded=findDocumentById(documentId);
        String fileName=documentUploaded.getCloudFileName();
        deleteFromS3(fileName);
        return true;
    }

    private void deleteFromS3(String fileName) {
        s3Client.deleteObject(bucketName, fileName);
    }

    @Override
    public Boolean deletePolicyImage(Long imageId) {
        String role= accessConService.getUserRole();
        if(!(role.equals("ADMIN") || role.equals("EMPLOYEE"))){
            throw new RoleAccessException("you don't have access");
        }
        Image image=imageRepository.findById(imageId).orElseThrow(()->new NoSuchElementException("image not found"));
        String imageName= image.getCloudImageName();
        deleteFromS3(imageName);
        return null;
    }

    private void mapWithUser(DocumentUploaded documentUploaded, DocumentUploadedDTO documentUploadedDTO) {
        if(documentUploadedDTO.getAgentId()!=null){
            Agent agent=findAgent(documentUploadedDTO.getAgentId());
            documentUploaded.setAgent(agent);
            documentUploaded=documentUploadedRepository.save(documentUploaded);
            agent.getDocuments().add(documentUploaded);
            agentRepository.save(agent);
        }
        if(documentUploadedDTO.getCustomerId()!=null){
            Customer customer=findCustomer(documentUploadedDTO.getCustomerId());
            documentUploaded.setCustomer(customer);
            documentUploaded=documentUploadedRepository.save(documentUploaded);
            customer.getDocuments().add(documentUploaded);
            customerRepository.save(customer);
        }
    }

    private Agent findAgent(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }
    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(()->new NoSuchElementException("agent not found"));
    }

    private DocumentUploaded findDocumentById(Long documentId) {
        return documentUploadedRepository.findById(documentId).orElseThrow(()->new NoSuchElementException("document not found"));
    }
    

    private void uploadDocToS3(File fileObj,String newFileName) {

        s3Client.putObject(new PutObjectRequest(bucketName, newFileName, fileObj));
        fileObj.delete();
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
