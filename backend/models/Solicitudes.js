const mongoose =require ('mongoose');

const requestsSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true
    },
    description :{
        type: String,
        require: [true, 'La descripcion es obligatoria'],
        trim: true
    }
},{
    timestamps:true,
    versionKey: false
});

//eliminar el indice problematico si existe 
categorySchema.pre('save', async function (next) {
    try {
        const collection =this.constructor.collection;
        const indexes = await collection.indexes();

        //Bucarcar y eliminar indice problematico con nombre "nombre_1"
        const problematicIndex = indexes.find(index => index.name === 'nombre_1');
        if(problematicIndex){
            await collection.dropIndex('nombre_1');
        }

    }catch( err){
        //Ignora si el indice no existe
        if(!err.message.includes('Index not found')){
            return next(err);
        }
    }
    next();
});
//Crear nuevo indice correcto
requestsSchema.index({name: 1},{
    unique: true,
    name: 'name_1'//Nombre para el indice
});
module.exports= mongoose.model('Requests',requestsSchema);