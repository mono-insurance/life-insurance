package com.monocept.app.service;

import com.monocept.app.dto.EmailDTO;

public interface EmailService {
    Boolean sendEmails(EmailDTO emailDTO);
}
