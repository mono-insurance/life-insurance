package com.monocept.app.service;

import com.monocept.app.dto.EmailDTO;
import com.monocept.app.exception.EmailNotSendException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService{
    @Autowired
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String sender;

    public EmailServiceImp(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public Boolean sendEmails(EmailDTO emailDTO) {
        MimeMessage mimeMessage
                = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;
        try {
            mimeMessageHelper
                    = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(emailDTO.getEmailId());
            String body= " Hi, i am agent from suraksha insurance !! \n Please use this link to create your policy in our company\n"+
                    "http:localhost/demo-policy/${emailDto.getAgentId()}";
            mimeMessageHelper.setText(body);
            mimeMessageHelper.setSubject(
                    "Congrats! account has been activated");
            javaMailSender.send(mimeMessage);
        }
        catch (MessagingException e) {
            throw new EmailNotSendException("can't send email to customer with subject: account activated");
        }
        return true;
    }
}
