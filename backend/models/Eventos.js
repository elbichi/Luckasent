const mongoose = require('mongoose');


const eventoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorizacion', // Referencia a la colección de categorías
    required: true
  },
  subCategoria: {
    type: String,
    trim: true
  },
  etiquetas: [{
    type: String,
    trim: true
  }],
  images: {
    type: String
  },
  prioridad: {
    type: String,
    enum: ['Alta', 'Normal', 'Baja'],
    default: 'Normal'
  },
  observaciones: {
    type: String
  },
  categorizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios'
  },
  fechaCategorizacion: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Eventos', eventoSchema);