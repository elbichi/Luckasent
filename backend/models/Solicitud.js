const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  tipoSolicitud: {
    type: String,
    required: true,
    enum: ['inscripcion', 'hospedaje', 'evento']
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'categorizada', 'procesada', 'rechazada'],
    default: 'pendiente'
  },
  categoria: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoriaSolicitud'
    },
    nombre: String,
    codigo: String
  },
  solicitante: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    telefono: {
      type: String,
      required: true
    },
    tipoParticipante: {
      type: String,
      enum: ['seminarista', 'externo'],
      required: true
    }
  },
  detalles: {
    seminarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seminario',
      required: true
    },
    necesitaHospedaje: {
      type: Boolean,
      default: false
    },
    comentarios: {
      type: String,
      maxlength: 1000
    }
  },
  fechaCategorizacion: Date,
  categorizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
solicitudSchema.index({ estado: 1 });
solicitudSchema.index({ 'categoria.id': 1 });
solicitudSchema.index({ 'detalles.seminarioId': 1 });

module.exports = mongoose.model('Solicitud', solicitudSchema);