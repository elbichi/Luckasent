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
  solicitudes: [{
    tipoSolicitud: {
      type: String,
      enum: ['Inscripción', 'Hospedaje', 'Alimentación', 'Transporte', 'Certificados', 'Administrativa', 'Otra']
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'La categoría es obligatoria'],
      ref: 'Categorizacion'
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
    fechaSolicitud: {
      type: Date,
      default: Date.now
    },
    fechaRespuesta: {
      type: Date
    }
  }],
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuario',
    required: [true, 'El responsable es obligatorio']
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
solicitudSchema.index({ 'solicitudes.estado': 1 });
solicitudSchema.index({ 'solicitudes.categoria': 1 });
solicitudSchema.index({ 'solicitudes.prioridad': 1 });
solicitudSchema.index({ email: 1 });

// Virtual para calcular días transcurridos por solicitud
solicitudSchema.virtual('solicitudesDiasTranscurridos').get(function() {
  return this.solicitudes.map(solicitud => {
    const ahora = new Date();
    const diferencia = ahora - solicitud.fechaSolicitud;
    return {
      id: solicitud._id,
      diasTranscurridos: Math.floor(diferencia / (1000 * 60 * 60 * 24))
    };
  });
});

module.exports = mongoose.model('Solicitud', solicitudSchema);