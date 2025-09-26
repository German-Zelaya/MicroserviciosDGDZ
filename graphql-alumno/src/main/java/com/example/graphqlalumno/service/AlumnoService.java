package com.example.graphqlalumno.service;

import com.example.graphqlalumno.entity.Alumno;
import com.example.graphqlalumno.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // Obtener todos los alumnos
    public List<Alumno> getAllAlumnos() {
        return alumnoRepository.findAll();
    }

    // Obtener alumno por ID
    public Optional<Alumno> getAlumnoById(Long id) {
        return alumnoRepository.findById(id);
    }

    // Crear nuevo alumno
    public Alumno createAlumno(String nombre, String apellido, Integer edad) {
        Alumno alumno = new Alumno(nombre, apellido, edad);
        return alumnoRepository.save(alumno);
    }

    // Actualizar alumno
    public Optional<Alumno> updateAlumno(Long id, String nombre, String apellido, Integer edad) {
        Optional<Alumno> alumnoOptional = alumnoRepository.findById(id);
        if (alumnoOptional.isPresent()) {
            Alumno alumno = alumnoOptional.get();
            if (nombre != null) alumno.setNombre(nombre);
            if (apellido != null) alumno.setApellido(apellido);
            if (edad != null) alumno.setEdad(edad);
            return Optional.of(alumnoRepository.save(alumno));
        }
        return Optional.empty();
    }

    // Eliminar alumno
    public boolean deleteAlumno(Long id) {
        if (alumnoRepository.existsById(id)) {
            alumnoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Buscar alumnos por nombre
    public List<Alumno> getAlumnosByNombre(String nombre) {
        return alumnoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // Buscar alumnos por apellido
    public List<Alumno> getAlumnosByApellido(String apellido) {
        return alumnoRepository.findByApellidoContainingIgnoreCase(apellido);
    }

    // Buscar alumnos por edad mayor a
    public List<Alumno> getAlumnosByEdadMayorA(Integer edad) {
        return alumnoRepository.findByEdadGreaterThan(edad);
    }

    // Buscar alumnos por rango de edad
    public List<Alumno> getAlumnosByEdadBetween(Integer edadMin, Integer edadMax) {
        return alumnoRepository.findByEdadBetween(edadMin, edadMax);
    }
}