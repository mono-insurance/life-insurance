package com.monocept.app.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleAccessException extends RuntimeException{
	
    public RoleAccessException(String message){
        super(message);
    }

}
