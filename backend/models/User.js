const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  lasname: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[0-9]{7,15}$/  // solo dígitos, mínimo 7 y máximo 15 caracteres
  },
  password: {
    type: String,
    required: true,
    select: false // No devolver el password en las consultas
  },
  role: {
    type: String,
    enum: ['admin', 'tesorero', 'participante', 'seminarista', 'logistico', 'externo'],
    default: 'participante'
  }
}, { timestamps: true });

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('usuarios', userSchema);