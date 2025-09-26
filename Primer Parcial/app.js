const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trabajadores_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Modelo Trabajador
const trabajadorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  cedulaIdentidad: { type: String, required: true, unique: true },
  cargo: { type: String, required: true },
  departamento: { type: String, required: true },
  fechaIngreso: { type: Date, required: true }
});

const Trabajador = mongoose.model('Trabajador', trabajadorSchema);

// Rutas

// GET para todos
app.get('/api/trabajadores', async (req, res) => {
  try {
    const trabajadores = await Trabajador.find();
    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET solo para un trabajador
app.get('/api/trabajadores/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findById(req.params.id);
    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }
    res.json(trabajador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST
app.post('/api/trabajadores', async (req, res) => {
  try {
    const trabajador = new Trabajador(req.body);
    const nuevoTrabajador = await trabajador.save();
    res.status(201).json(nuevoTrabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT
app.put('/api/trabajadores/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }
    res.json(trabajador);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/trabajadores/:id', async (req, res) => {
  try {
    const trabajador = await Trabajador.findByIdAndDelete(req.params.id);
    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }
    res.json({ message: 'Trabajador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Trabajadores funcionando correctamente' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});