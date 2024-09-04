package com.monocept.app.exception;

public class EmailNotSendException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    public EmailNotSendException(String message) {
        super(message);
    }
}
