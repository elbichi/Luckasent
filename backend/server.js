require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const{MongoClient, ObjectId} = require('mongodb');
//importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categotyRoutes');
//const subcategoryRoutes = require('./routes/subcategoryRoutes');
//const productRoutes = require('./routes/productRoutes');

// Primero declaramos app
const app = express();

// Luego usamos app
const mongoClient = new MongoClient(process.env.MONGODB_URI);
(async ()=>{
    await mongoClient.connect();
    app.set('mongoDb', mongoClient.db());
    console.log('Conexión directa a mongoDB establecida'); // Corregir typo
})();

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Conexion a mongo 
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log('Ok MonfoDB conectado'))
.catch(error => console.error('X Error de MongoDB', error.message));

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categorizacion',categoryRoutes);


//Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor en http://localhost:${PORT}`);
});