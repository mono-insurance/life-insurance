package com.monocept.app.service;

import com.monocept.app.dto.AdminCreationDTO;
import com.monocept.app.dto.AdminDTO;

public interface AdminService {

    AdminDTO getAdminProfile();

    AdminDTO makeAnotherAdmin(AdminCreationDTO adminCreationDTO);

    AdminDTO updateAdminProfile(AdminDTO adminDTO);

}
