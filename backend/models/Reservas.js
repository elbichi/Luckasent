const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios', // <-- corregido
        required: [true, 'El usuario es obligatorio']
    },
    recurso: {
        type: String,
        required: true
    },
    fechaInicio:{
        type: Date,
        required: true
    },
    fechaFin:{
        type: Date,
        required: true
    },
    estado:{
        type: String,
        enum: ['Pendiente', 'Confirmada', 'Cancelada', 'finalizada'],
        default: 'Pendiente'
    },
    observaciones:{
        type: String,
        trim: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorizacion',
        required: false // o true si es obligatorio
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Reserva', reservaSchema);