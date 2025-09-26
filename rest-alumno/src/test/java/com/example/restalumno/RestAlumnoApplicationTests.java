package com.example.restalumno;

import com.example.restalumno.entity.Alumno;
import com.example.restalumno.repository.AlumnoRepository;
import com.example.restalumno.service.AlumnoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureTestMvc
@Transactional
class RestAlumnoApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private ObjectMapper objectMapper;

    // =================== TESTS BÁSICOS ===================

    @Test
    void contextLoads() {
        // Verifica que el contexto de Spring se carga correctamente
        assertThat(alumnoRepository).isNotNull();
        assertThat(alumnoService).isNotNull();
        assertThat(mockMvc).isNotNull();
    }

    @Test
    void shouldLoadInitialData() {
        // Verifica que se carguen los datos iniciales
        long count = alumnoRepository.count();
        assertThat(count).isGreaterThan(0);
        System.out.println("✅ Datos iniciales cargados: " + count + " alumnos");
    }

    // =================== TESTS DE ENDPOINTS ===================

    @Test
    void shouldGetAllAlumnos() throws Exception {
        mockMvc.perform(get("/api/alumnos/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(greaterThan(0))));
    }

    @Test
    void shouldGetAlumnosWithPagination() throws Exception {
        mockMvc.perform(get("/api/alumnos")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "nombre")
                        .param("sortDir", "asc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.size").value(5));
    }

    @Test
    void shouldCreateNewAlumno() throws Exception {
        String nuevoAlumnoJson = """
                {
                    "nombre": "Test",
                    "apellido": "Usuario",
                    "edad": 25,
                    "email": "test.usuario@email.com",
                    "telefono": "+591 70000000",
                    "direccion": "Calle Test #123"
                }
                """;

        mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(nuevoAlumnoJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Test"))
                .andExpect(jsonPath("$.apellido").value("Usuario"))
                .andExpect(jsonPath("$.edad").value(25))
                .andExpect(jsonPath("$.email").value("test.usuario@email.com"));
    }

    @Test
    void shouldGetAlumnoById() throws Exception {
        // Crear un alumno para la prueba
        Alumno alumno = new Alumno("Juan", "Test", 22, "juan.test@email.com", "+591 70111111", "Calle Test");
        Alumno savedAlumno = alumnoRepository.save(alumno);

        mockMvc.perform(get("/api/alumnos/{id}", savedAlumno.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedAlumno.getId()))
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.apellido").value("Test"));
    }

    @Test
    void shouldUpdateAlumno() throws Exception {
        // Crear un alumno para actualizar
        Alumno alumno = new Alumno("Original", "Nombre", 20, "original@email.com", "+591 70222222", "Dirección Original");
        Alumno savedAlumno = alumnoRepository.save(alumno);

        String updateJson = """
                {
                    "nombre": "Actualizado",
                    "apellido": "Apellido",
                    "edad": 23
                }
                """;

        mockMvc.perform(put("/api/alumnos/{id}", savedAlumno.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Actualizado"))
                .andExpect(jsonPath("$.apellido").value("Apellido"))
                .andExpect(jsonPath("$.edad").value(23));
    }

    @Test
    void shouldDeleteAlumno() throws Exception {
        // Crear un alumno para eliminar
        Alumno alumno = new Alumno("Para", "Eliminar", 21, "eliminar@email.com", "+591 70333333", "Calle Temporal");
        Alumno savedAlumno = alumnoRepository.save(alumno);

        mockMvc.perform(delete("/api/alumnos/{id}", savedAlumno.getId()))
                .andExpect(status().isNoContent());

        // Verificar que fue eliminado
        assertThat(alumnoRepository.findById(savedAlumno.getId())).isEmpty();
    }

    // =================== TESTS DE BÚSQUEDAS ===================

    @Test
    void shouldSearchAlumnosByNombre() throws Exception {
        // Crear alumno con nombre específico para buscar
        Alumno alumno = new Alumno("BuscarNombre", "Test", 24, "buscar.nombre@email.com", "+591 70444444", "Calle Buscar");
        alumnoRepository.save(alumno);

        mockMvc.perform(get("/api/alumnos/nombre/BuscarNombre"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].nombre").value("BuscarNombre"));
    }

    @Test
    void shouldSearchAlumnosByEdadRange() throws Exception {
        mockMvc.perform(get("/api/alumnos/edad/rango")
                        .param("edadMin", "20")
                        .param("edadMax", "25"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void shouldGetAdvancedSearch() throws Exception {
        mockMvc.perform(get("/api/alumnos/buscar")
                        .param("nombre", "Juan")
                        .param("edadMin", "18")
                        .param("edadMax", "30")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    // =================== TESTS DE ESTADÍSTICAS ===================

    @Test
    void shouldGetEstadisticas() throws Exception {
        mockMvc.perform(get("/api/alumnos/estadisticas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAlumnos").isNumber())
                .andExpect(jsonPath("$.edadPromedio").isNumber())
                .andExpect(jsonPath("$.alumnosJovenes").isNumber())
                .andExpect(jsonPath("$.alumnosAdultos").isNumber());
    }

    // =================== TESTS DE VALIDACIONES ===================

    @Test
    void shouldFailWithInvalidData() throws Exception {
        String invalidAlumnoJson = """
                {
                    "nombre": "",
                    "apellido": "",
                    "edad": 10,
                    "email": "email-invalido"
                }
                """;

        mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidAlumnoJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailWithDuplicateEmail() throws Exception {
        // Crear primer alumno
        String primerAlumnoJson = """
                {
                    "nombre": "Primero",
                    "apellido": "Usuario",
                    "edad": 22,
                    "email": "duplicado@email.com"
                }
                """;

        mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(primerAlumnoJson))
                .andExpect(status().isCreated());

        // Intentar crear segundo alumno con mismo email
        String segundoAlumnoJson = """
                {
                    "nombre": "Segundo",
                    "apellido": "Usuario",
                    "edad": 23,
                    "email": "duplicado@email.com"
                }
                """;

        mockMvc.perform(post("/api/alumnos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(segundoAlumnoJson))
                .andExpect(status().isConflict());
    }

    @Test
    void shouldReturn404ForNonExistentAlumno() throws Exception {
        mockMvc.perform(get("/api/alumnos/99999"))
                .andExpect(status().isNotFound());
    }

    // =================== TEST DE PERFORMANCE BÁSICO ===================

    @Test
    void shouldHandleMultipleRequests() throws Exception {
        // Simular múltiples requests
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/alumnos/all"))
                    .andExpect(status().isOk());
        }
        System.out.println("✅ Performance test: 5 requests completadas exitosamente");
    }
}