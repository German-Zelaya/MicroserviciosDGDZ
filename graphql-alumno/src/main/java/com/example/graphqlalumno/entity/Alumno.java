package com.example.graphqlalumno.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

@Entity
@Table(name = "alumnos")
@Schema(description = "Entidad que representa un alumno")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del alumno", example = "1")
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Nombre del alumno", required = true, example = "Juan")
    private String nombre;

    @Column(nullable = false)
    @Schema(description = "Apellido del alumno", required = true, example = "Pérez")
    private String apellido;

    @Column
    @Schema(description = "Edad del alumno", example = "21")
    private Integer edad;

    // Constructores
    public Alumno() {}

    public Alumno(String nombre, String apellido, Integer edad) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
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

    @Override
    public String toString() {
        return "Alumno{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", edad=" + edad +
                '}';
    }
}