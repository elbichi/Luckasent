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
   type : String,
   required: [true, 'El tipo de solicitud es obligatorio'],
   enum: ['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Ministerio', 'Administrativa', 'Otra']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Ministerio', 'Administrativa', 'Otra']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  estado: {
    type: String,
    required: [true, 'El estado de la solicitud es obligatorio'],
    enum: ['Nueva', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada', 'Pendiente Info'],
    default: 'Nueva'
  },
  prioridad: {
    type: String,
    required: [true, 'La prioridad es obligatoria'],
    enum: ['Alta', 'Media', 'Baja'],
    default: 'Media'
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    //ref: 'Usuario',
    required: [true, 'El responsable es obligatorio']
  },
  fechasolicitud: {
    type: Date,
    default: Date.now
  },
  fechaRespuesta: {
    type: Date
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },

}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar rendimiento
solicitudSchema.index({ estado: 1 });
solicitudSchema.index({ categoria: 1 });
solicitudSchema.index({ prioridad: 1 });
solicitudSchema.index({ fechaSolicitud: -1 });
solicitudSchema.index({ email: 1 });

// Virtual para calcular días transcurridos
solicitudSchema.virtual('diasTranscurridos').get(function() {
  const ahora = new Date();
  const diferencia = ahora - this.fechaSolicitud;
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
});

// Middleware pre-save para actualizar fechaRespuesta
solicitudSchema.pre('save', function(next) {
  if (this.isModified('estado') && 
      ['Aprobada', 'Rechazada', 'Completada'].includes(this.estado) && 
      !this.fechaRespuesta) {
    this.fechaRespuesta = new Date();
  }
  next();
});

module.exports = mongoose.model('Solicitud', solicitudSchema);