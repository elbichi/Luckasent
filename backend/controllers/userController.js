const { connect } = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
//const { use } = require('react');

//Obtener todos los usuarios (Solo Admin)
exports.getAllUsers = async (req, res)=>{
    console.log('[CONTROLLER] Ejecutando getAllUsers');
    try {
        const users = await User.find().select('-password');
        console.log('[CONTROLLER] - getAllUsers Users found:', users.length);
        res.status(200).json({
            success: true, 
            data: users });
    } catch (error) {
        console.error('[CONTROLLER] - getAllUsers Error:', error);
        res.status(500).json({
            success: false, 
            message: 'Error retrieving users', error });
    }
};

//Obtener usuario espesifico
exports.getUserById = async(req, res)=>{
    try{
        const user = await User.findById(req.params.id).select('-password');      
        
        if (!user){
            return res.status(404).json({
                success: false,
                message:'Usuario no encontrado'
            });
        }
        // Validaciones de acceso
        if (req.userRole === 'tesorero' && req.userId !== user._id.toString()){
            return res.status(403).json({
                success: false,
                message:'No puedes ver usuario admin'
            });
        }
        if (req.userRole === 'externo' && req.userId !== user._id.toString()){
            return res.status(403).json({
                success: false,
                message:'No puedes ver usuario admin'
            });
        }
        if (req.userRole === 'seminarista' && req.userId !== user._id.toString()){
            return res.status(403).json({
                success: false,
                message:'No puedes ver usuario admin'
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Error al optener usuario', error: error.message
            });
        }
};

//Crear usurio (Admin y Coordinador)
exports.createUser = async (req, res )=> {
    try{
        const {nombre, apellido, correo,telefono,tipoDocumento,numeroDocumento,estado, password,role} = req.body;

        const user = new User({
            nombre,
            apellido,
            correo,
            telefono,
            tipoDocumento,
            numeroDocumento,
            estado,
            password: await bcrypt.hash(password,10),
            role
        });
        const savedUser =await user.save();
        res.status(201).json({
            success: true,
            message:'Usuario creado exitosamente',
            user:{
                id: savedUser._id,
                nombre: savedUser.nombre,
                apellido: savedUser.apellido,
                correo: savedUser.correo,
                telefono: savedUser.telefono,
                tipoDocumento: savedUser.tipoDocumento,
                numeroDocumento: savedUser.numeroDocumento,
                estado: savedUser.estado,
                role:savedUser.role
            }
        });
    }catch (error){
        res.status(500).json({
            success: false,
            message:'Error al crear usuario', error:error.message
        });
    }
};

// axtualixar usuario (admin y coordinador)
exports.updateUser = async(req, res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,
            {$set :req.body},
            {new: true}
        ).select('-password');

        if (!updatedUser){
            return res.status(404).json({
                success: false,
                message:'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message:'Usuario  actualizado correcta mente',
            user: updatedUser
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario', 
            error: error.message
        });
    }
};

// Eliminar usuaario (solo admin)
exports.deleteUser = async(req, res)=>{
    console.log('[CONTROLLER ] Ejecutando deleteUser para ID:', req.params.id);//Diagnostico
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser){
            console.log('[CONTROLLER] Usuario no encontrado para eliminar');//Diagnostico
            return res.status(404).json({
                success:false,
                message: 'Usuario no encontrado'
            });
        }
        console.log('[CONTROLLER] Usuario eliminado:', deletedUser._id);//Diagnostico
        res.status(200).json({
            success:true,
            message: 'Usuario eliminado correctamente'
        });
    }catch(error){
        console.error('[CONTROLLER] Error al elimniar usuario', error.message);//Diagnostico
        res.status(500).json({
            success:false,
            message: 'Error al eliminar usuario'
        });
    }
};