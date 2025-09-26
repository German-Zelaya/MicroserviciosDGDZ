
package com.example.restalumno.repository;

import com.example.restalumno.entity.Alumno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {
    
    // Búsquedas básicas con paginación
    Page<Alumno> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
    Page<Alumno> findByApellidoContainingIgnoreCase(String apellido, Pageable pageable);
    
    // Búsquedas básicas sin paginación
    List<Alumno> findByNombreContainingIgnoreCase(String nombre);
    List<Alumno> findByApellidoContainingIgnoreCase(String apellido);
    List<Alumno> findByEmailContainingIgnoreCase(String email);
    
    // Búsquedas por edad
    List<Alumno> findByEdadGreaterThan(Integer edad);
    List<Alumno> findByEdadLessThan(Integer edad);
    List<Alumno> findByEdadBetween(Integer edadMin, Integer edadMax);
    
    // Búsquedas combinadas
    List<Alumno> findByNombreContainingIgnoreCaseAndApellidoContainingIgnoreCase(String nombre, String apellido);
    
    // Búsqueda por email único
    Optional<Alumno> findByEmailIgnoreCase(String email);
    
    // Verificar existencia por email
    boolean existsByEmailIgnoreCase(String email);
    
    // Consultas personalizadas con JPQL
    @Query("SELECT a FROM Alumno a WHERE a.edad BETWEEN :edadMin AND :edadMax")
    Page<Alumno> findByEdadBetweenWithPagination(@Param("edadMin") Integer edadMin, 
                                                  @Param("edadMax") Integer edadMax, 
                                                  Pageable pageable);
    
    @Query("SELECT a FROM Alumno a WHERE " +
           "(:nombre IS NULL OR LOWER(a.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:apellido IS NULL OR LOWER(a.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))) AND " +
           "(:email IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND " +
           "(:edadMin IS NULL OR a.edad >= :edadMin) AND " +
           "(:edadMax IS NULL OR a.edad <= :edadMax)")
    Page<Alumno> findByFilters(@Param("nombre") String nombre,
                               @Param("apellido") String apellido,
                               @Param("email") String email,
                               @Param("edadMin") Integer edadMin,
                               @Param("edadMax") Integer edadMax,
                               Pageable pageable);
    
    // Estadísticas
    @Query("SELECT COUNT(a) FROM Alumno a WHERE a.edad BETWEEN :edadMin AND :edadMax")
    long countByEdadBetween(@Param("edadMin") Integer edadMin, @Param("edadMax") Integer edadMax);
    
    @Query("SELECT AVG(a.edad) FROM Alumno a")
    Double getAverageAge();
}