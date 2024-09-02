package com.monocept.app.exception;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(UserException exception) {
		ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage(),
				LocalDateTime.now());

		return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);

	}
	


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException exception) {
		Map<String, String> errors = new HashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
		
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}
	
	
	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(Exception exception) {

		// create a Student Error Message
		ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(),exception.getClass().getSimpleName(),
				LocalDateTime.now());
		System.out.println("printing error");
		exception.printStackTrace();

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
	
	
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleException(AccessDeniedException exception) {

		ErrorResponse error = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(),exception.getClass().getSimpleName(),
				LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
	}
	

}
