// models/CategoriaSolicitud.js
const mongoose = require('mongoose');

const categoriaSolicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  lugar: {
    nombre: {
      type: String,
      required: [true, 'El nombre del lugar es obligatorio']
    },
    direccion: {
      type: String,
      required: [true, 'La dirección del lugar es obligatoria']
    }
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios'
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Categorizacion', categoriaSolicitudSchema);