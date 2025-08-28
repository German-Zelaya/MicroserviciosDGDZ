const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'usuarios_db'
});

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Función para conectar a la base de datos con reintentos
function connectWithRetry() {
  db.connect((err) => {
    if (err) {
      console.error('Error conectando a MySQL:', err);S
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado a MySQL');
      initializeDatabase();
    }
  });
}

// Función para inicializar la base de datos
function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creando tabla:', err);
    } else {
      console.log('Tabla usuarios creada o ya existe');
    }
  });
}

// Rutas
// Página principal - listar usuarios
app.get('/', (req, res) => {
  const query = 'SELECT * FROM usuarios ORDER BY fecha_registro DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error obteniendo usuarios:', err);
      res.render('index', { usuarios: [], error: 'Error al cargar usuarios' });
    } else {
      res.render('index', { usuarios: results, error: null });
    }
  });
});

// Página para agregar usuario
app.get('/agregar', (req, res) => {
  res.render('agregar', { error: null, success: null });
});

// Procesar formulario de agregar usuario
app.post('/agregar', (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
    return res.render('agregar', { 
      error: 'Nombre y email son requeridos', 
      success: null 
    });
  }
  
  const query = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
  
  db.query(query, [nombre, email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.render('agregar', { 
          error: 'Este email ya está registrado', 
          success: null 
        });
      } else {
        console.error('Error insertando usuario:', err);
        res.render('agregar', { 
          error: 'Error al agregar usuario', 
          success: null 
        });
      }
    } else {
      res.render('agregar', { 
        error: null, 
        success: 'Usuario agregado exitosamente' 
      });
    }
  });
});

// Eliminar usuario
app.post('/eliminar/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error eliminando usuario:', err);
    }
    res.redirect('/');
  });
});

// Manejar cierre de la aplicación
process.on('SIGINT', () => {
  console.log('Cerrando conexión a la base de datos...');
  db.end();
  process.exit();
});

// Iniciar conexión y servidor
connectWithRetry();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});