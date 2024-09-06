package com.monocept.app.service;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.app.entity.Image;

public interface ImageService {

	Image saveImage(MultipartFile image);

}
