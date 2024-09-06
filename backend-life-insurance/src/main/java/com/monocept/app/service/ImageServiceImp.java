package com.monocept.app.service;

import com.monocept.app.entity.Policy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.entity.Image;

@Service
public class ImageServiceImp implements ImageService{
	@Autowired
	private StorageService storageService;

	@Override
	public void saveImage(MultipartFile image, Policy savedPolicy) {
		storageService.addNewInsuranceImages(savedPolicy.getPolicyId(),image);
	}

}
