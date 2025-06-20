const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
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
        emnum: ['Pendiente', 'Confirmada', 'Cancelada', 'finalizada'],
        default: 'Pendiente'
    },
    observaciones:{
        type: String,
        trim: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Reserva', reservaSchema);