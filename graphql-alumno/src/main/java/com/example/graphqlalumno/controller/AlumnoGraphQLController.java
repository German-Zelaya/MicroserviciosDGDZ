package com.example.graphqlalumno.controller;


import com.example.graphqlalumno.entity.Alumno;
import com.example.graphqlalumno.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class AlumnoGraphQLController {

    @Autowired
    private AlumnoService alumnoService;

    // =================== QUERIES ===================

    @QueryMapping
    public List<Alumno> alumnos() {
        return alumnoService.getAllAlumnos();
    }

    @QueryMapping
    public Optional<Alumno> alumno(@Argument Long id) {
        return alumnoService.getAlumnoById(id);
    }

    @QueryMapping
    public List<Alumno> alumnosPorNombre(@Argument String nombre) {
        return alumnoService.getAlumnosByNombre(nombre);
    }

    @QueryMapping
    public List<Alumno> alumnosPorApellido(@Argument String apellido) {
        return alumnoService.getAlumnosByApellido(apellido);
    }

    @QueryMapping
    public List<Alumno> alumnosPorEdadMayorA(@Argument Integer edad) {
        return alumnoService.getAlumnosByEdadMayorA(edad);
    }

    @QueryMapping
    public List<Alumno> alumnosPorRangoEdad(@Argument Integer edadMin, @Argument Integer edadMax) {
        return alumnoService.getAlumnosByEdadBetween(edadMin, edadMax);
    }

    // =================== MUTATIONS ===================

    @MutationMapping
    public Alumno crearAlumno(@Argument String nombre, @Argument String apellido, @Argument Integer edad) {
        return alumnoService.createAlumno(nombre, apellido, edad);
    }

    @MutationMapping
    public Optional<Alumno> actualizarAlumno(@Argument Long id, @Argument String nombre, 
                                           @Argument String apellido, @Argument Integer edad) {
        return alumnoService.updateAlumno(id, nombre, apellido, edad);
    }

    @MutationMapping
    public Boolean eliminarAlumno(@Argument Long id) {
        return alumnoService.deleteAlumno(id);
    }
}