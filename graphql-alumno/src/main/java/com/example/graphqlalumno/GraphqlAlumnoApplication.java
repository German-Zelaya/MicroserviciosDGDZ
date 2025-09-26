package com.example.graphqlalumno;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GraphqlAlumnoApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphqlAlumnoApplication.class, args);
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🚀 Aplicación GraphQL iniciada exitosamente!");
        System.out.println("=".repeat(60));
        System.out.println("🗄️  H2 Console: http://localhost:8080/h2-console");
        System.out.println("🔗 GraphQL Endpoint: http://localhost:8080/graphql");
        System.out.println("=".repeat(60) + "\n");
    }
}