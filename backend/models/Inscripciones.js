const mongoose =require('mongoose');

const inscripcionSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required:true,
    },
    evento:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required:true,
    },
    fechaInscripcion:{
        type: Date,
        deafault: Date.now,
    },
    estado:{
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
        default: 'pendiente',
    },
    observaciones:{
        type: String,
        trim: true,
    }
    },{
        timestamps: true,
    });
//Manejo de errores de duplicado

module.exports = mongoose.model('Inscripcion', inscripcionSchema);