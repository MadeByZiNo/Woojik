package com.madebyzino.Woojik.error;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<Object> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();

        // 클라이언트에게 보낼 JSON 형식
        Map<String, Object> body = Map.of(
                "status", errorCode.getStatus().value(),
                "error", errorCode.getStatus().name(),
                "message", errorCode.getMessage()
        );

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(body);
    }
}