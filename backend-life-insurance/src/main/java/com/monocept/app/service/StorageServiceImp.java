package com.monocept.app.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.monocept.app.dto.CustomUserDetails;
import com.monocept.app.dto.DocumentUploadedDTO;
import com.monocept.app.dto.EmailDTO;
import com.monocept.app.entity.*;
import com.monocept.app.exception.RoleAccessException;
import com.monocept.app.exception.UserException;
import com.monocept.app.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class StorageServiceImp implements StorageService {
    private final DocumentUploadedRepository documentUploadedRepository;
    private final PolicyRepository policyRepository;
    private final ImageRepository imageRepository;
    private final AgentRepository agentRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    @Value("${application.bucket.name}")
    private String bucketName;
    @Autowired
    private AmazonS3 s3Client;
    private final AccessConService accessConService;

    public StorageServiceImp(DocumentUploadedRepository documentUploadedRepository, PolicyRepository policyRepository,
                             ImageRepository imageRepository, AgentRepository agentRepository, CustomerRepository customerRepository,
                             EmailService emailService, AccessConService accessConService) {
        this.documentUploadedRepository = documentUploadedRepository;
        this.policyRepository = policyRepository;
        this.imageRepository = imageRepository;
        this.agentRepository = agentRepository;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
        this.accessConService = accessConService;
    }

    @Override
    public Boolean addNewInsuranceImages(Long policyId, MultipartFile file) {
        accessConService.checkEmployeeAccess();
        File fileObj = convertMultiPartFileToFile(file);
        String newFileName = System.currentTimeMillis() + "_" + policyId + file.getOriginalFilename();
        uploadDocToS3(fileObj, newFileName);
        Image image = new Image();
        Policy policy = policyRepository.findById(policyId).orElseThrow(() -> new UserException("policy not found"));
        if (image.getPolicies() != null) image.getPolicies().add(policy);
        else {
            List<Policy> policyList = new ArrayList<>();
            policyList.add(policy);
            image.setPolicies(policyList);
        }
        image.setCloudImageName(newFileName);
        image = imageRepository.save(image);
        policy.setImage(image);
        policyRepository.save(policy);
        return true;
    }

    @Override
    public byte[] downloadFile(Long documentId) {
        accessConService.checkDocumentAccess(documentId);

        DocumentUploaded documentUploaded = findDocumentById(documentId);
        String fileName = documentUploaded.getName();
        return downloadFromS3(fileName);
    }

    @Override
    public byte[] downloadPolicyImage(Long pid) {
        Policy policy = policyRepository.findById(pid).orElseThrow(() -> new UserException("policy not found"));
        Image image = policy.getImage();
        String cloudFileName = image.getCloudImageName();
        return downloadFromS3(cloudFileName);
    }

    private byte[] downloadFromS3(String fileName) {
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
    public Boolean addUserDocuments(DocumentUploadedDTO documentUploadedDTO, MultipartFile file) {
        CustomUserDetails customUserDetails=accessConService.checkUserAccess();
        if(customUserDetails.getId() == null){
            throw new RoleAccessException("you don't have access to upload documents");
        }
        File fileObj = convertMultiPartFileToFile(file);
        String newFileName = System.currentTimeMillis() + "_" + documentUploadedDTO.getDocumentType() + file.getOriginalFilename();
        uploadDocToS3(fileObj, newFileName);
        DocumentUploaded documentUploaded = new DocumentUploaded();
        documentUploaded.setIsApproved(false);
        documentUploaded.setName(documentUploadedDTO.getDocumentType());
        documentUploaded.setCloudFileName(newFileName);
        mapWithUser(documentUploaded, documentUploadedDTO);

        return true;
    }

    @Override
    public Boolean deleteDocument(Long documentId) {
        accessConService.checkDocumentDeleteAccess(documentId);
        DocumentUploaded documentUploaded = findDocumentById(documentId);
        String fileName = documentUploaded.getCloudFileName();
        deleteFromS3(fileName);
        documentUploaded.setIsApproved(false);
        documentUploadedRepository.save(documentUploaded);
        EmailDTO emailDTO=new EmailDTO();
        if(documentUploaded.getAgent()!=null)  emailDTO.setEmailId(documentUploaded.getAgent().getCredentials().getEmail());
        else  if(documentUploaded.getCustomer()!=null)  emailDTO.setEmailId(documentUploaded.getCustomer().getCredentials().getEmail());

        emailDTO.setTitle("Document Deleted successfully");
        emailDTO.setBody("Oops!! your document "+documentUploaded.getDocumentType()+" has been deleted, please upload it again.\n");

        emailService.sendAccountCreationEmail(emailDTO);
        return true;
    }

    private void deleteFromS3(String fileName) {
        s3Client.deleteObject(bucketName, fileName);
    }

    @Override
    public Boolean deletePolicyImage(Long imageId) {
        accessConService.checkEmployeeAccess();
        Image image = imageRepository.findById(imageId).orElseThrow(() -> new UserException("image not found"));
        String imageName = image.getCloudImageName();
        deleteFromS3(imageName);
        return null;
    }


    private void mapWithUser(DocumentUploaded documentUploaded, DocumentUploadedDTO documentUploadedDTO) {
        if (documentUploadedDTO.getAgentId() != null) {
            Agent agent = findAgent(documentUploadedDTO.getAgentId());
            documentUploaded.setAgent(agent);
            documentUploaded = documentUploadedRepository.save(documentUploaded);
            if (agent.getDocuments() != null) agent.getDocuments().add(documentUploaded);
            else {
                List<DocumentUploaded> documentUploadedList = new ArrayList<>();
                documentUploadedList.add(documentUploaded);
                agent.setDocuments(documentUploadedList);
            }
            agentRepository.save(agent);
            EmailDTO emailDTO=new EmailDTO();
            emailDTO.setEmailId(agent.getCredentials().getEmail());

            emailDTO.setTitle("Document uploaded successfully");
            emailDTO.setBody("Congrats!! your document "+documentUploaded.getDocumentType()+" has been uploaded.\n");
            emailService.sendAccountCreationEmail(emailDTO);
        }
        if (documentUploadedDTO.getCustomerId() != null) {
            Customer customer = findCustomer(documentUploadedDTO.getCustomerId());
            documentUploaded.setCustomer(customer);
            documentUploaded = documentUploadedRepository.save(documentUploaded);
            if (customer.getDocuments() != null) customer.getDocuments().add(documentUploaded);
            else {
                List<DocumentUploaded> documentUploadedList = new ArrayList<>();
                documentUploadedList.add(documentUploaded);
                customer.setDocuments(documentUploadedList);
            }
            customerRepository.save(customer);
            EmailDTO emailDTO=new EmailDTO();
            emailDTO.setEmailId(customer.getCredentials().getEmail());

            emailDTO.setTitle("Document uploaded successfully");
            emailDTO.setBody("Congrats!! your document "+documentUploaded.getDocumentType()+" has been uploaded.\n");
            emailService.sendAccountCreationEmail(emailDTO);
        }
    }

    private Agent findAgent(Long agentId) {
        return agentRepository.findById(agentId).orElseThrow(() -> new UserException("agent not found"));
    }

    private Customer findCustomer(Long customerId) {
        return customerRepository.findById(customerId).orElseThrow(() -> new UserException("agent not found"));
    }

    private DocumentUploaded findDocumentById(Long documentId) {
        return documentUploadedRepository.findById(documentId).orElseThrow(() -> new UserException("document not found"));
    }


    private void uploadDocToS3(File fileObj, String newFileName) {

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

    @Override
    public byte[] updatePolicyImage(Long pid, MultipartFile file) {
    	accessConService.checkEmployeeAccess();
        Policy policy = policyRepository.findById(pid).orElseThrow(() -> new UserException("Policy not found"));


        Image existingImage = policy.getImage();
        if (existingImage != null && existingImage.getCloudImageName() != null) {
            // Ensure cloud image name exists before trying to delete
            deleteFromS3(existingImage.getCloudImageName());
            
            // Remove the existing image from the policy and repository
            policy.setImage(null);
            imageRepository.delete(existingImage);
        }

        File fileObj = convertMultiPartFileToFile(file);
        String newFileName = System.currentTimeMillis() + "_" + pid + "_" + file.getOriginalFilename();
        uploadDocToS3(fileObj, newFileName);

        Image newImage = new Image();
        newImage.setCloudImageName(newFileName);
        List<Policy> policyList = new ArrayList<>();
        policyList.add(policy);
        newImage.setPolicies(policyList);
        newImage = imageRepository.save(newImage);


        policy.setImage(newImage);
        policyRepository.save(policy);

        return downloadFromS3(newFileName);
    }

    
}
