// Cambiar a la base de datos de la aplicación
db = db.getSiblingDB('usuarios');

// Crear colección de usuarios si no existe
db.createCollection('users');

// Insertar un usuario de prueba (opcional)
db.users.insertOne({
    correo: 'admin@test.com',
    password: '123456',
    nombre: 'Administrador',
    rol: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
});

print('Base de datos usuarios inicializada correctamente');