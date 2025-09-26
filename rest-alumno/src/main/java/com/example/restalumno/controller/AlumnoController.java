package com.example.restalumno.controller;

import com.example.restalumno.dto.AlumnoCreateDTO;
import com.example.restalumno.dto.AlumnoUpdateDTO;
import com.example.restalumno.entity.Alumno;
import com.example.restalumno.service.AlumnoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alumnos")
@Tag(name = "Gestión de Alumnos", description = "Operaciones CRUD y búsquedas para alumnos")
@CrossOrigin(origins = "*")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    // =================== GET - LISTAR TODOS ===================

    @GetMapping
    @Operation(summary = "Obtener todos los alumnos", 
               description = "Retorna una lista paginada de todos los alumnos registrados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente",
                    content = @Content(mediaType = "application/json", 
                                     array = @ArraySchema(schema = @Schema(implementation = Alumno.class))))
    })
    public ResponseEntity<Page<Alumno>> getAllAlumnos(
            @Parameter(description = "Número de página (empezando en 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Campo para ordenar", example = "nombre")
            @RequestParam(defaultValue = "id") String sortBy,
            
            @Parameter(description = "Dirección del ordenamiento (asc/desc)", example = "asc")
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Alumno> alumnos = alumnoService.getAllAlumnosWithPagination(pageable);
        
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/all")
    @Operation(summary = "Obtener todos los alumnos sin paginación", 
               description = "Retorna una lista completa de todos los alumnos sin paginación")
    public ResponseEntity<List<Alumno>> getAllAlumnosWithoutPagination() {
        List<Alumno> alumnos = alumnoService.getAllAlumnos();
        return ResponseEntity.ok(alumnos);
    }

    // =================== GET - POR ID ===================

    @GetMapping("/{id}")
    @Operation(summary = "Obtener alumno por ID", 
               description = "Retorna un alumno específico por su identificador único")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Alumno encontrado",
                    content = @Content(mediaType = "application/json", 
                                     schema = @Schema(implementation = Alumno.class))),
        @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    })
    public ResponseEntity<Alumno> getAlumnoById(
            @Parameter(description = "ID único del alumno", example = "1", required = true)
            @PathVariable Long id) {
        
        Alumno alumno = alumnoService.getAlumnoById(id);
        return ResponseEntity.ok(alumno);
    }

    // =================== BÚSQUEDAS ===================

    @GetMapping("/buscar")
    @Operation(summary = "Búsqueda avanzada de alumnos", 
               description = "Busca alumnos usando múltiples filtros opcionales con paginación")
    public ResponseEntity<Page<Alumno>> searchAlumnos(
            @Parameter(description = "Nombre a buscar (búsqueda parcial)", example = "Juan")
            @RequestParam(required = false) String nombre,
            
            @Parameter(description = "Apellido a buscar (búsqueda parcial)", example = "Pérez")
            @RequestParam(required = false) String apellido,
            
            @Parameter(description = "Email a buscar (búsqueda parcial)", example = "juan@email.com")
            @RequestParam(required = false) String email,
            
            @Parameter(description = "Edad mínima", example = "18")
            @RequestParam(required = false) Integer edadMin,
            
            @Parameter(description = "Edad máxima", example = "25")
            @RequestParam(required = false) Integer edadMax,
            
            @Parameter(description = "Número de página", example = "0")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Tamaño de página", example = "10")
            @RequestParam(defaultValue = "10") int size,
            
            @Parameter(description = "Campo para ordenar", example = "nombre")
            @RequestParam(defaultValue = "id") String sortBy,
            
            @Parameter(description = "Dirección del ordenamiento", example = "asc")
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Alumno> result = alumnoService.searchAlumnos(nombre, apellido, email, edadMin, edadMax, pageable);
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/nombre/{nombre}")
    @Operation(summary = "Buscar alumnos por nombre", 
               description = "Busca alumnos que contengan el nombre especificado (no case sensitive)")
    public ResponseEntity<List<Alumno>> getAlumnosByNombre(
            @Parameter(description = "Nombre a buscar", example = "Juan", required = true)
            @PathVariable String nombre) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByNombre(nombre);
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/apellido/{apellido}")
    @Operation(summary = "Buscar alumnos por apellido", 
               description = "Busca alumnos que contengan el apellido especificado (no case sensitive)")
    public ResponseEntity<List<Alumno>> getAlumnosByApellido(
            @Parameter(description = "Apellido a buscar", example = "García", required = true)
            @PathVariable String apellido) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByApellido(apellido);
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Buscar alumnos por email", 
               description = "Busca alumnos que contengan el email especificado")
    public ResponseEntity<List<Alumno>> getAlumnosByEmail(
            @Parameter(description = "Email a buscar", example = "juan@email.com", required = true)
            @PathVariable String email) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByEmail(email);
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/edad/mayor/{edad}")
    @Operation(summary = "Buscar alumnos por edad mayor a", 
               description = "Busca alumnos con edad mayor a la especificada")
    public ResponseEntity<List<Alumno>> getAlumnosByEdadMayorA(
            @Parameter(description = "Edad mínima", example = "20", required = true)
            @PathVariable Integer edad) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByEdadMayorA(edad);
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/edad/menor/{edad}")
    @Operation(summary = "Buscar alumnos por edad menor a", 
               description = "Busca alumnos con edad menor a la especificada")
    public ResponseEntity<List<Alumno>> getAlumnosByEdadMenorA(
            @Parameter(description = "Edad máxima", example = "25", required = true)
            @PathVariable Integer edad) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByEdadMenorA(edad);
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/edad/rango")
    @Operation(summary = "Buscar alumnos por rango de edad", 
               description = "Busca alumnos en un rango de edad específico")
    public ResponseEntity<List<Alumno>> getAlumnosByRangoEdad(
            @Parameter(description = "Edad mínima", example = "18", required = true)
            @RequestParam Integer edadMin,
            
            @Parameter(description = "Edad máxima", example = "25", required = true)
            @RequestParam Integer edadMax) {
        
        List<Alumno> alumnos = alumnoService.getAlumnosByEdadBetween(edadMin, edadMax);
        return ResponseEntity.ok(alumnos);
    }

    // =================== POST - CREAR ===================

    @PostMapping
    @Operation(summary = "Crear nuevo alumno", 
               description = "Crea un nuevo alumno con los datos proporcionados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Alumno creado correctamente",
                    content = @Content(mediaType = "application/json", 
                                     schema = @Schema(implementation = Alumno.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "409", description = "Email ya existe")
    })
    public ResponseEntity<Alumno> createAlumno(
            @Valid @RequestBody AlumnoCreateDTO alumnoDTO) {
        
        Alumno nuevoAlumno = alumnoService.createAlumno(alumnoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAlumno);
    }

    // =================== PUT - ACTUALIZAR ===================

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar alumno completo", 
               description = "Actualiza todos los datos de un alumno existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Alumno actualizado correctamente",
                    content = @Content(mediaType = "application/json", 
                                     schema = @Schema(implementation = Alumno.class))),
        @ApiResponse(responseCode = "404", description = "Alumno no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "409", description = "Email ya existe")
    })
    public ResponseEntity<Alumno> updateAlumno(
            @Parameter(description = "ID del alumno", example = "1", required = true)
            @PathVariable Long id,
            
            @Valid @RequestBody AlumnoUpdateDTO alumnoDTO) {
        
        Alumno alumnoActualizado = alumnoService.updateAlumno(id, alumnoDTO);
        return ResponseEntity.ok(alumnoActualizado);
    }

    // =================== DELETE - ELIMINAR ===================

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar alumno", 
               description = "Elimina un alumno por su ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Alumno eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Alumno no encontrado")
    })
    public ResponseEntity<Void> deleteAlumno(
            @Parameter(description = "ID del alumno", example = "1", required = true)
            @PathVariable Long id) {
        
        alumnoService.deleteAlumno(id);
        return ResponseEntity.noContent().build();
    }

    // =================== ESTADÍSTICAS ===================

    @GetMapping("/estadisticas")
    @Operation(summary = "Obtener estadísticas de alumnos", 
               description = "Retorna estadísticas generales sobre los alumnos registrados")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        estadisticas.put("totalAlumnos", alumnoService.countAlumnos());
        estadisticas.put("edadPromedio", alumnoService.getAverageAge());
        estadisticas.put("alumnosJovenes", alumnoService.countAlumnosByEdadBetween(16, 22));
        estadisticas.put("alumnosAdultos", alumnoService.countAlumnosByEdadBetween(23, 99));
        
        return ResponseEntity.ok(estadisticas);
    }
}