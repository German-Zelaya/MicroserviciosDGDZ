-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS usuarios_db;

-- Usar la base de datos
USE usuarios_db;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos usuarios de ejemplo
INSERT INTO usuarios (nombre, email) VALUES
('Daniel De La Torre', 'daniel@email.com'),
('Priscila Arduz', 'priscila@email.com'),
('Alberto Torres', 'alberto@email.com')
ON DUPLICATE KEY UPDATE nombre = nombre;