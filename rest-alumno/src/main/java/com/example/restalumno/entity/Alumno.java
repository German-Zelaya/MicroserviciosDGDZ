package com.example.restalumno.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Entity
@Table(name = "alumnos")
@Schema(description = "Entidad que representa un alumno")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del alumno", example = "1")
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre del alumno", required = true, example = "Juan")
    private String nombre;

    @Column(nullable = false)
    @NotBlank(message = "El apellido es obligatorio")
    @Schema(description = "Apellido del alumno", required = true, example = "Pérez")
    private String apellido;

    @Column
    @Min(value = 16, message = "La edad debe ser mayor a 15 años")
    @Max(value = 99, message = "La edad debe ser menor a 100 años")
    @Schema(description = "Edad del alumno", example = "21")
    private Integer edad;

    @Column
    @Schema(description = "Email del alumno", example = "juan.perez@email.com")
    private String email;

    @Column(length = 15)
    @Schema(description = "Teléfono del alumno", example = "+591 7012345")
    private String telefono;

    @Column
    @Schema(description = "Dirección del alumno", example = "Av. Arce #1234, La Paz")
    private String direccion;

    // Constructores
    public Alumno() {}

    public Alumno(String nombre, String apellido, Integer edad) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
    }

    public Alumno(String nombre, String apellido, Integer edad, String email, String telefono, String direccion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    @Override
    public String toString() {
        return "Alumno{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", edad=" + edad +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", direccion='" + direccion + '\'' +
                '}';
    }
}