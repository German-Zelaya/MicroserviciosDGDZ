package com.example.graphqlalumno.repository;

import com.example.graphqlalumno.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    
    // Buscar alumnos por nombre
    List<Alumno> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar alumnos por apellido
    List<Alumno> findByApellidoContainingIgnoreCase(String apellido);
    
    // Buscar alumnos por edad mayor a
    List<Alumno> findByEdadGreaterThan(Integer edad);
    
    // Buscar alumnos por edad menor a
    List<Alumno> findByEdadLessThan(Integer edad);
    
    // Buscar alumnos por rango de edad
    @Query("SELECT a FROM Alumno a WHERE a.edad BETWEEN :edadMin AND :edadMax")
    List<Alumno> findByEdadBetween(@Param("edadMin") Integer edadMin, @Param("edadMax") Integer edadMax);
    
    // Buscar alumnos por nombre y apellido
    List<Alumno> findByNombreContainingIgnoreCaseAndApellidoContainingIgnoreCase(String nombre, String apellido);
}