const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  solicitante: {
    type: String,
    required: [true, 'El nombre del solicitante es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true,'el email es obligatorio'],
    lowercase: true,
    trim : true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  tipoSolicitud: {
    type: String,
    enum: ['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Administrativa', 'Otra'],
    required: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorizacion', // Referencia a la colección de categorías
    required: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  estado: {
    type: String,
    enum: ['Nueva', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada', 'Pendiente Info'],
    default: 'Nueva'
  },
  prioridad: {
    type: String,
    enum: ['Alta', 'Media', 'Baja'],
    default: 'Media'
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  fechaRespuesta: {
    type: Date
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario', // Persona o rol que lo envió
    required: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario'
  },
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Solicitud', solicitudSchema);