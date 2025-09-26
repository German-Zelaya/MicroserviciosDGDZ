package com.example.restalumno.exception;

public class AlumnoNotFoundException extends RuntimeException {
    public AlumnoNotFoundException(String message) {
        super(message);
    }

    public AlumnoNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}