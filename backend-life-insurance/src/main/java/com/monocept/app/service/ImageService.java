package com.monocept.app.service;

import com.monocept.app.entity.Policy;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.entity.Image;

public interface ImageService {

	void saveImage(MultipartFile image, Policy savedPolicy);

}
