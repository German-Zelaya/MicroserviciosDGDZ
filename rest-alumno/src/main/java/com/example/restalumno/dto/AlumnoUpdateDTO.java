package com.example.restalumno.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

@Schema(description = "DTO para actualizar un alumno existente")
public class AlumnoUpdateDTO {

    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Schema(description = "Nombre del alumno", example = "Juan")
    private String nombre;

    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Schema(description = "Apellido del alumno", example = "Pérez")
    private String apellido;

    @Min(value = 16, message = "La edad debe ser mayor a 15 años")
    @Max(value = 99, message = "La edad debe ser menor a 100 años")
    @Schema(description = "Edad del alumno", example = "21", minimum = "16", maximum = "99")
    private Integer edad;

    @Email(message = "El email debe tener un formato válido")
    @Schema(description = "Email del alumno", example = "juan.perez@email.com")
    private String email;

    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{7,15}$", message = "Formato de teléfono inválido")
    @Schema(description = "Teléfono del alumno", example = "+591 7012345")
    private String telefono;

    @Size(max = 100, message = "La dirección no puede exceder 100 caracteres")
    @Schema(description = "Dirección del alumno", example = "Av. Arce #1234, La Paz")
    private String direccion;

    // Constructores
    public AlumnoUpdateDTO() {}

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
}
