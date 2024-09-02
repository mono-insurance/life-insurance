package com.monocept.app.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleAccessException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    private HttpStatus status;
    private String message;
    public RoleAccessException(String message){
        super(message);
    }

}
