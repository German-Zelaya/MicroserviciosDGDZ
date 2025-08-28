const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const { estado, orden } = req.query;
    let filtro = {};
    
    // Filtrar por estado si se proporciona
    if (estado && estado !== 'todos') {
      filtro.estado = estado;
    }
    
    // Ordenamiento
    let ordenamiento = { fechaCreacion: -1 }; // Por defecto, más recientes primero
    if (orden === 'antiguos') {
      ordenamiento = { fechaCreacion: 1 };
    } else if (orden === 'titulo') {
      ordenamiento = { titulo: 1 };
    }
    
    const tasks = await Task.find(filtro).sort(ordenamiento);
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
});

// GET - Obtener una tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
});

// POST - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    
    // Validaciones básicas
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son obligatorios'
      });
    }
    
    const newTask = new Task({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      estado: estado || 'pendiente'
    });
    
    const savedTask = await newTask.save();
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: savedTask
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(400).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
});

// PUT - Actualizar tarea completa
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, estado } = req.body;
    
    // Validaciones
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son obligatorios'
      });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estado: estado || 'pendiente'
      },
      { 
        new: true, // Devolver el documento actualizado
        runValidators: true // Ejecutar validaciones del schema
      }
    );
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
});

// PATCH - Actualizar solo el estado de la tarea
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El estado es obligatorio'
      });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el estado',
      error: error.message
    });
  }
});

// DELETE - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: deletedTask
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
});

// GET - Obtener estadísticas de tareas
router.get('/stats/resumen', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Task.countDocuments();
    
    res.json({
      success: true,
      data: {
        total,
        porEstado: stats
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;