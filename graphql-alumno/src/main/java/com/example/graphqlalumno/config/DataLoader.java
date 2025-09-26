package com.example.graphqlalumno.config;

import com.example.graphqlalumno.entity.Alumno;
import com.example.graphqlalumno.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Override
    public void run(String... args) throws Exception {
        // Cargar datos de ejemplo si la tabla está vacía
        if (alumnoRepository.count() == 0) {
            cargarDatosDeEjemplo();
        }
    }

    private void cargarDatosDeEjemplo() {
        System.out.println("Cargando datos de ejemplo...");

        alumnoRepository.save(new Alumno("Juan", "Pérez", 21));
        alumnoRepository.save(new Alumno("María", "González", 20));
        alumnoRepository.save(new Alumno("Carlos", "López", 22));
        alumnoRepository.save(new Alumno("Ana", "Martínez", 19));
        alumnoRepository.save(new Alumno("Pedro", "Rodríguez", 23));
        alumnoRepository.save(new Alumno("Laura", "Sánchez", 20));
        alumnoRepository.save(new Alumno("Diego", "Herrera", 24));
        alumnoRepository.save(new Alumno("Sofia", "Torres", 18));
        alumnoRepository.save(new Alumno("Miguel", "Vargas", 25));
        alumnoRepository.save(new Alumno("Carmen", "Jiménez", 22));

        System.out.println("Se han cargado " + alumnoRepository.count() + " alumnos de ejemplo.");
    }
}