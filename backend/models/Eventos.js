const mongoose = require('mongoose');


const eventsSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        unique: true
    },

    description :{
        type: String,
        required: [true, 'la descripcion es oblicatoria'],
        trim: true

    },
    price :{
        type: Number,
        required: [true, 'la precio es oblicatoria'],
        min: [0, 'El precio no puede ser negativo ']  
    },
    stock :{
        type: Number,
        required: [true, 'la stock es requerido'],
        min: [0, 'El stock no puede ser negativo ']  
    },
    category :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'la Categoria es requerida ']
    },
    subcategory :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: [true, 'la Subcategoria  es requerida ']
    },
    images :{
        type: String

    },


},{
    timestamps: true,
    versionKey: false
});

// Manejo de errores de duplicados 
eventsSchema.post('save', function(error,doc,next){
    if (error.name === 'MongoServerError' && error.code === 11000){
        next(new Error ('Ya existe el producto con ese nombre'));

    }else{
        next(error)
    }
});

module.exports= mongoose.model('Events', eventsSchema);