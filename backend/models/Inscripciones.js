const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios', // Debe coincidir con User.js
        required: true,
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Eventos', // Debe coincidir con Eventos.js
        required: true,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorizacion',
        required: true,
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
        default: 'pendiente',
    },
    observaciones: {
        type: String,
        trim: true,
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);