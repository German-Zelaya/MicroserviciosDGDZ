// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_usuarios'
};

// Clave secreta para JWT
const SECRET_KEY = '123';

// Endpoint de autenticación
app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  // Validar datos
  if (!correo || !password) {
    return res.status(400).json({ 
      error: 'Correo y password son requeridos' 
    });
  }

  try {
    // Conectar a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Buscar usuario
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );

    await connection.end();

    // Verificar si existe el usuario
    if (rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const usuario = rows[0];

    // Comparar password
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        correo: usuario.correo 
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error en el servidor' 
    });
  }
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});