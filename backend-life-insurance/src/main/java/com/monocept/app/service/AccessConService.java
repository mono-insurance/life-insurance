package com.monocept.app.service;

import com.monocept.app.dto.CustomUserDetails;

public interface AccessConService {
    CustomUserDetails checkUserAccess();

    String getUserRole();
}