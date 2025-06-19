// models/CategoriaSolicitud.js
const mongoose = require('mongoose');

const categoriaSolicitudSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 500
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    maxlength: 10
  },
  activo: {
    type: Boolean,
    default: true
  },
  prioridad: {
    type: Number,
    default: 1
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  lugar: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    direccion: {
      type: String,
      required: true,
      trim: true
    },
    capacidad: {
      type: Number,
      min: 0
    },
    disponible: {
      type: Boolean,
      default: true
    }
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fotos: [{
    url: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      trim: true
    },
    principal: {
      type: Boolean,
      default: false
    },
    fechaSubida: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// Asegurar que solo una foto sea la principal
categoriaSolicitudSchema.pre('save', function(next) {
  if (this.fotos && this.fotos.length > 0) {
    const principalFotos = this.fotos.filter(foto => foto.principal);
    if (principalFotos.length > 1) {
      const firstPrincipal = principalFotos[0];
      this.fotos.forEach(foto => {
        if (foto !== firstPrincipal) {
          foto.principal = false;
        }
      });
    }
  }
  next();
});

module.exports = mongoose.model('CategoriaSolicitud', categoriaSolicitudSchema);