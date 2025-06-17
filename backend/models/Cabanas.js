const mongoose = require('mongoose');

const cabanaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true
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
    capacity: {
        type: Number,
        required: [true, 'La capacidad es obligatoria'],
        min: [1, 'Debe tener al menos una persona']
    },
    location: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'la Categoria es requerida ']
    },
    images: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Manejo de errores de duplicados
cabanaSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error('Ya existe una cabaña con ese nombre'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('Cabanas', cabanaSchema);