const mongoose = require('mongoose');


const eventsSchema = new mongoose.Schema({
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
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Conferencia', 'Taller', 'Seminario', 'Retiro', 'Ministerial', 'Social', 'Otro'],
        default: 'Otro'
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
        default: 'Normal'
    },
    observaciones: {
        type: String
    },
    categorizadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fechaCategorizacion: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
});

// Método para categorizar un evento
eventsSchema.methods.categorizar = function(categoriaId, prioridad, observaciones, usuarioId) {
    this.category = categoriaId;
    this.prioridad = prioridad;
    this.observaciones = observaciones;
    this.categorizadoPor = usuarioId;
    this.fechaCategorizacion = new Date();
    return this.save();
};

// Obtener estadísticas de eventos por categoría y prioridad
eventsSchema.statics.obtenerEstadisticas = function() {
    return this.aggregate([
        {
            $group: {
                _id: {
                    categoria: '$category',
                    prioridad: '$prioridad'
                },
                total: { $sum: 1 }
            }
        }
    ]);
};

// Buscar eventos por categoría
eventsSchema.statics.buscarPorCategoria = function(categoriaId) {
    return this.find({ category: categoriaId });
};

// Buscar eventos por prioridad
eventsSchema.statics.buscarPorPrioridad = function(prioridad) {
    return this.find({ prioridad });
};

module.exports = mongoose.model('eventos', eventsSchema);