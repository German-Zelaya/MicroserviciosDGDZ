package com.example.restalumno.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO de respuesta con información completa del alumno")
public class AlumnoResponseDTO {

    @Schema(description = "ID único del alumno", example = "1")
    private Long id;

    @Schema(description = "Nombre del alumno", example = "Juan")
    private String nombre;

    @Schema(description = "Apellido del alumno", example = "Pérez")
    private String apellido;

    @Schema(description = "Edad del alumno", example = "21")
    private Integer edad;

    @Schema(description = "Email del alumno", example = "juan.perez@email.com")
    private String email;

    @Schema(description = "Teléfono del alumno", example = "+591 7012345")
    private String telefono;

    @Schema(description = "Dirección del alumno", example = "Av. Arce #1234, La Paz")
    private String direccion;

    // Constructores
    public AlumnoResponseDTO() {}

    public AlumnoResponseDTO(Long id, String nombre, String apellido, Integer edad, 
                           String email, String telefono, String direccion) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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