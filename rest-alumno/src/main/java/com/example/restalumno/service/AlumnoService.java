package com.example.restalumno.service;

import com.example.restalumno.dto.AlumnoCreateDTO;
import com.example.restalumno.dto.AlumnoUpdateDTO;
import com.example.restalumno.entity.Alumno;
import com.example.restalumno.exception.AlumnoNotFoundException;
import com.example.restalumno.exception.EmailAlreadyExistsException;
import com.example.restalumno.repository.AlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    // =================== OPERACIONES CRUD ===================

    @Transactional(readOnly = true)
    public List<Alumno> getAllAlumnos() {
        return alumnoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Alumno> getAllAlumnosWithPagination(Pageable pageable) {
        return alumnoRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Alumno getAlumnoById(Long id) {
        return alumnoRepository.findById(id)
                .orElseThrow(() -> new AlumnoNotFoundException("Alumno no encontrado con ID: " + id));
    }

    public Alumno createAlumno(AlumnoCreateDTO alumnoDTO) {
        // Verificar email único si se proporciona
        if (alumnoDTO.getEmail() != null && !alumnoDTO.getEmail().trim().isEmpty()) {
            if (alumnoRepository.existsByEmailIgnoreCase(alumnoDTO.getEmail())) {
                throw new EmailAlreadyExistsException("El email " + alumnoDTO.getEmail() + " ya existe");
            }
        }

        Alumno alumno = new Alumno();
        alumno.setNombre(alumnoDTO.getNombre());
        alumno.setApellido(alumnoDTO.getApellido());
        alumno.setEdad(alumnoDTO.getEdad());
        alumno.setEmail(alumnoDTO.getEmail());
        alumno.setTelefono(alumnoDTO.getTelefono());
        alumno.setDireccion(alumnoDTO.getDireccion());

        return alumnoRepository.save(alumno);
    }

    public Alumno updateAlumno(Long id, AlumnoUpdateDTO alumnoDTO) {
        Alumno alumno = getAlumnoById(id);

        // Verificar email único si se está actualizando
        if (alumnoDTO.getEmail() != null && !alumnoDTO.getEmail().trim().isEmpty()) {
            Optional<Alumno> existingAlumno = alumnoRepository.findByEmailIgnoreCase(alumnoDTO.getEmail());
            if (existingAlumno.isPresent() && !existingAlumno.get().getId().equals(id)) {
                throw new EmailAlreadyExistsException("El email " + alumnoDTO.getEmail() + " ya existe");
            }
        }

        // Actualizar solo los campos no nulos
        if (alumnoDTO.getNombre() != null) alumno.setNombre(alumnoDTO.getNombre());
        if (alumnoDTO.getApellido() != null) alumno.setApellido(alumnoDTO.getApellido());
        if (alumnoDTO.getEdad() != null) alumno.setEdad(alumnoDTO.getEdad());
        if (alumnoDTO.getEmail() != null) alumno.setEmail(alumnoDTO.getEmail());
        if (alumnoDTO.getTelefono() != null) alumno.setTelefono(alumnoDTO.getTelefono());
        if (alumnoDTO.getDireccion() != null) alumno.setDireccion(alumnoDTO.getDireccion());

        return alumnoRepository.save(alumno);
    }

    public void deleteAlumno(Long id) {
        if (!alumnoRepository.existsById(id)) {
            throw new AlumnoNotFoundException("Alumno no encontrado con ID: " + id);
        }
        alumnoRepository.deleteById(id);
    }

    // =================== BÚSQUEDAS ===================

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByNombre(String nombre) {
        return alumnoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByApellido(String apellido) {
        return alumnoRepository.findByApellidoContainingIgnoreCase(apellido);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByEmail(String email) {
        return alumnoRepository.findByEmailContainingIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByEdadMayorA(Integer edad) {
        return alumnoRepository.findByEdadGreaterThan(edad);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByEdadMenorA(Integer edad) {
        return alumnoRepository.findByEdadLessThan(edad);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByEdadBetween(Integer edadMin, Integer edadMax) {
        return alumnoRepository.findByEdadBetween(edadMin, edadMax);
    }

    @Transactional(readOnly = true)
    public List<Alumno> getAlumnosByNombreAndApellido(String nombre, String apellido) {
        return alumnoRepository.findByNombreContainingIgnoreCaseAndApellidoContainingIgnoreCase(nombre, apellido);
    }

    // =================== BÚSQUEDAS CON PAGINACIÓN ===================

    @Transactional(readOnly = true)
    public Page<Alumno> searchAlumnos(String nombre, String apellido, String email, 
                                     Integer edadMin, Integer edadMax, Pageable pageable) {
        return alumnoRepository.findByFilters(nombre, apellido, email, edadMin, edadMax, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Alumno> getAlumnosByNombreWithPagination(String nombre, Pageable pageable) {
        return alumnoRepository.findByNombreContainingIgnoreCase(nombre, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Alumno> getAlumnosByApellidoWithPagination(String apellido, Pageable pageable) {
        return alumnoRepository.findByApellidoContainingIgnoreCase(apellido, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Alumno> getAlumnosByEdadBetweenWithPagination(Integer edadMin, Integer edadMax, Pageable pageable) {
        return alumnoRepository.findByEdadBetweenWithPagination(edadMin, edadMax, pageable);
    }

    // =================== ESTADÍSTICAS ===================

    @Transactional(readOnly = true)
    public long countAlumnos() {
        return alumnoRepository.count();
    }

    @Transactional(readOnly = true)
    public long countAlumnosByEdadBetween(Integer edadMin, Integer edadMax) {
        return alumnoRepository.countByEdadBetween(edadMin, edadMax);
    }

    @Transactional(readOnly = true)
    public Double getAverageAge() {
        return alumnoRepository.getAverageAge();
    }

    // =================== VALIDACIONES ===================

    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return alumnoRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return alumnoRepository.existsByEmailIgnoreCase(email);
    }

    @Transactional(readOnly = true)
    public Optional<Alumno> findByEmail(String email) {
        return alumnoRepository.findByEmailIgnoreCase(email);
    }
}