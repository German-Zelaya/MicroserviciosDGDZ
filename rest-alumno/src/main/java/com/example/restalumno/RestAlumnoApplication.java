@SpringBootApplication
public class RestAlumnoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestAlumnoApplication.class, args);
        
        System.out.println("\n" + "=".repeat(65));
        System.out.println("🚀 API REST de Alumnos iniciada exitosamente!");
        System.out.println("=".repeat(65));
        System.out.println("📊 Swagger UI: http://localhost:8081/swagger-ui/index.html");
        System.out.println("📋 OpenAPI JSON: http://localhost:8081/v3/api-docs");
        System.out.println("🗄️  H2 Console: http://localhost:8081/h2-console");
        System.out.println("🔗 API Base URL: http://localhost:8081/api/alumnos");
        System.out.println("📱 Endpoints disponibles:");
        System.out.println("   • GET    /api/alumnos - Lista todos los alumnos");
        System.out.println("   • GET    /api/alumnos/{id} - Obtiene alumno por ID");
        System.out.println("   • POST   /api/alumnos - Crea nuevo alumno");
        System.out.println("   • PUT    /api/alumnos/{id} - Actualiza alumno");
        System.out.println("   • DELETE /api/alumnos/{id} - Elimina alumno");
        System.out.println("   • GET    /api/alumnos/buscar - Búsqueda avanzada");
        System.out.println("   • GET    /api/alumnos/estadisticas - Estadísticas");
        System.out.println("=".repeat(65));
        System.out.println("💡 Tip: Ve a Swagger UI para probar la API interactivamente");
        System.out.println("🎯 15 alumnos de ejemplo ya están cargados automáticamente");
        System.out.println("=".repeat(65) + "\n");
    }
}