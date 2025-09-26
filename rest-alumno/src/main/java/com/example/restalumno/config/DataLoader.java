package com.example.restalumno.config;

import com.example.restalumno.entity.Alumno;
import com.example.restalumno.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (alumnoRepository.count() == 0) {
            cargarDatosDeEjemplo();
        }
    }

    private void cargarDatosDeEjemplo() {
        System.out.println("🔄 Cargando datos de ejemplo...");

        // Datos más realistas con todos los campos
        Alumno[] alumnos = {
            new Alumno("Juan", "Pérez", 21, "juan.perez@email.com", "+591 70123456", "Av. Arce #1234, La Paz"),
            new Alumno("María", "González", 20, "maria.gonzalez@email.com", "+591 70234567", "Calle Murillo #567, La Paz"),
            new Alumno("Carlos", "López", 22, "carlos.lopez@email.com", "+591 70345678", "Av. 6 de Agosto #890, La Paz"),
            new Alumno("Ana", "Martínez", 19, "ana.martinez@email.com", "+591 70456789", "Calle Comercio #234, La Paz"),
            new Alumno("Pedro", "Rodríguez", 23, "pedro.rodriguez@email.com", "+591 70567890", "Av. Camacho #456, La Paz"),
            new Alumno("Laura", "Sánchez", 20, "laura.sanchez@email.com", "+591 70678901", "Calle Sagárnaga #789, La Paz"),
            new Alumno("Diego", "Herrera", 24, "diego.herrera@email.com", "+591 70789012", "Av. Illimani #012, La Paz"),
            new Alumno("Sofía", "Torres", 18, "sofia.torres@email.com", "+591 70890123", "Calle Jaén #345, La Paz"),
            new Alumno("Miguel", "Vargas", 25, "miguel.vargas@email.com", "+591 70901234", "Av. Ballivián #678, La Paz"),
            new Alumno("Carmen", "Jiménez", 22, "carmen.jimenez@email.com", "+591 71012345", "Calle Potosí #901, La Paz"),
            new Alumno("Roberto", "Cruz", 21, "roberto.cruz@email.com", "+591 71123456", "Av. América #123, La Paz"),
            new Alumno("Valentina", "Morales", 19, "valentina.morales@email.com", "+591 71234567", "Calle Linares #456, La Paz"),
            new Alumno("Fernando", "Gutierrez", 23, "fernando.gutierrez@email.com", "+591 71345678", "Av. Montes #789, La Paz"),
            new Alumno("Isabella", "Ramírez", 20, "isabella.ramirez@email.com", "+591 71456789", "Calle Ingavi #012, La Paz"),
            new Alumno("Alejandro", "Silva", 24, "alejandro.silva@email.com", "+591 71567890", "Av. Prado #345, La Paz")
        };

        for (Alumno alumno : alumnos) {
            alumnoRepository.save(alumno);
        }

        System.out.println("✅ Se han cargado " + alumnoRepository.count() + " alumnos de ejemplo.");
        System.out.println("📊 Datos listos para usar en la API REST!");
    }
}