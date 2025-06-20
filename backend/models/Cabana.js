const mongoose = require('mongoose');

const cabanaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String },
  capacidad: { type: Number, required: true },
  categoria: { type: String }, // Puedes definir un enum si tienes categorías fijas
  estado: { type: String, enum: ['disponible', 'ocupada', 'mantenimiento'], default: 'disponible' },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios' }
}, { timestamps: true });

module.exports = mongoose.model('Cabana', cabanaSchema);