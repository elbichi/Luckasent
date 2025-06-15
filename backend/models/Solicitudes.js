const mongoose = require('mongoose');
const solicitudSchema = new mongoose.Schema({
  // Datos básicos del solicitante
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true
  },
  cedula: {
    type: String,
    required: true,
    unique: true
  },
  fechaNacimiento: {
    type: Date
  },
  iglesia: {
    type: String,
    required: true
  },
  pastor: {
    type: String
  },
  telefonoPastor: {
    type: String
  },
  
  // Tipo de participante
  tipoParticipante: {
    type: String,
    enum: ['Seminarista', 'Externo', 'Organizador'],
    required: true
  },
  
  // Estado de la solicitud
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada'],
    default: 'Pendiente'
  },
  
  // CAMPOS PARA CATEGORIZACIÓN (CU03)
  categoria: {
    type: String,
    enum: ['Sin Categorizar', 'Prioritaria', 'Normal', 'Lista de Espera'],
    default: 'Sin Categorizar'
  },
  
  prioridad: {
    type: String,
    enum: ['Alta', 'Media', 'Normal'],
    default: 'Normal'
  },
  
  // Observaciones de categorización
  observaciones: {
    type: String,
    default: ''
  },
  
  // Experiencia previa
  experienciaPrevia: {
    type: String
  },
  
  // Documentos adjuntos
  documentos: [{
    nombre: String,
    url: String,
    tipo: {
      type: String,
      enum: ['cedula', 'carta_pastoral', 'comprobante_pago', 'otro']
    }
  }],
  
  // Control de fechas
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  
  fechaCategorizacion: {
    type: Date
  },
  
  fechaRespuesta: {
    type: Date
  },
  
  // Referencias
  seminarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seminario'
  },
  
  categorizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  respondidoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Control de estado
  activo: {
    type: Boolean,
    default: true
  },
  
  motivoRechazo: {
    type: String
  }
  
}, {
  timestamps: true
});

// Índices para optimizar consultas
solicitudSchema.index({ estado: 1, categoria: 1 });
solicitudSchema.index({ email: 1 });
solicitudSchema.index({ cedula: 1 });
solicitudSchema.index({ fechaSolicitud: -1 });

// Middleware para actualizar fechaCategorizacion
solicitudSchema.pre('save', function(next) {
  if (this.isModified('categoria') || this.isModified('prioridad')) {
    this.fechaCategorizacion = new Date();
  }
  next();
});

// Métodos del esquema
solicitudSchema.methods.categorizar = function(categoria, prioridad, observaciones, usuarioId) {
  this.categoria = categoria;
  this.prioridad = prioridad;
  this.observaciones = observaciones;
  this.categorizadoPor = usuarioId;
  this.fechaCategorizacion = new Date();
  return this.save();
};

solicitudSchema.methods.cambiarEstado = function(nuevoEstado, usuarioId, motivo = '') {
  this.estado = nuevoEstado;
  this.respondidoPor = usuarioId;
  this.fechaRespuesta = new Date();
  if (motivo) {
    this.motivoRechazo = motivo;
  }
  return this.save();
};

// Métodos estáticos
solicitudSchema.statics.obtenerEstadisticas = function() {
  return this.aggregate([
    {
      $match: { activo: true }
    },
    {
      $group: {
        _id: null,
        totalSolicitudes: { $sum: 1 },
        pendientes: {
          $sum: { $cond: [{ $eq: ['$estado', 'Pendiente'] }, 1, 0] }
        },
        aprobadas: {
          $sum: { $cond: [{ $eq: ['$estado', 'Aprobada'] }, 1, 0] }
        },
        rechazadas: {
          $sum: { $cond: [{ $eq: ['$estado', 'Rechazada'] }, 1, 0] }
        },
        sinCategorizar: {
          $sum: { $cond: [{ $eq: ['$categoria', 'Sin Categorizar'] }, 1, 0] }
        },
        prioritarias: {
          $sum: { $cond: [{ $eq: ['$categoria', 'Prioritaria'] }, 1, 0] }
        },
        prioridadAlta: {
          $sum: { $cond: [{ $eq: ['$prioridad', 'Alta'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports= mongoose.model('Solicitud',solicitudSchema);