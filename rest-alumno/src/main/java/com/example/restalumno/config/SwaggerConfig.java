package com.example.restalumno.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API REST - Gestión de Alumnos")
                        .description("**Sistema de gestión completo para alumnos** 🎓\n\n" +
                                   "Esta API REST proporciona operaciones CRUD completas para gestionar información de alumnos, " +
                                   "incluyendo búsquedas avanzadas, validaciones, paginación y estadísticas.\n\n" +
                                   "### Características principales:\n" +
                                   "- ✅ Operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar)\n" +
                                   "- 🔍 Búsquedas avanzadas con múltiples filtros\n" +
                                   "- 📄 Paginación y ordenamiento\n" +
                                   "- ✨ Validaciones de datos\n" +
                                   "- 📊 Estadísticas y reportes\n" +
                                   "- 🛡️ Manejo de excepciones personalizado\n" +
                                   "- 📧 Validación de emails únicos\n\n" +
                                   "### Endpoints disponibles:\n" +
                                   "- **GET /api/alumnos**: Lista paginada de alumnos\n" +
                                   "- **GET /api/alumnos/{id}**: Obtener alumno por ID\n" +
                                   "- **POST /api/alumnos**: Crear nuevo alumno\n" +
                                   "- **PUT /api/alumnos/{id}**: Actualizar alumno\n" +
                                   "- **DELETE /api/alumnos/{id}**: Eliminar alumno\n" +
                                   "- **GET /api/alumnos/buscar**: Búsqueda avanzada\n" +
                                   "- **GET /api/alumnos/estadisticas**: Estadísticas\n")
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo")
                                .email("desarrollo@alumnosapi.com")
                                .url("https://github.com/tu-usuario/rest-alumno-api"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("🏠 Servidor de desarrollo local"),
                        new Server()
                                .url("https://api-alumnos-prod.com")
                                .description("🚀 Servidor de producción")
                ))
                .externalDocs(new ExternalDocumentation()
                        .description("📚 Documentación completa en GitHub")
                        .url("https://github.com/tu-usuario/rest-alumno-api/wiki"));
    }
}
