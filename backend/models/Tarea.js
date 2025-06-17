const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String },
    estado: { type: String, enum: ['pendiente', 'en progreso', 'completada'], default: 'pendiente' },
    asignadoA: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fechaLimite: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Tarea', tareaSchema);