const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  estado: {
    type: String,
    required: true,
    enum: {
      values: ['pendiente', 'en progreso', 'completado'],
      message: 'El estado debe ser: pendiente, en progreso o completado'
    },
    default: 'pendiente'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Método para formatear la fecha
taskSchema.methods.getFechaFormateada = function() {
  return this.fechaCreacion.toLocaleDateString('es-ES');
};

// Índice para búsquedas más rápidas
taskSchema.index({ estado: 1, fechaCreacion: -1 });

module.exports = mongoose.model('Task', taskSchema);