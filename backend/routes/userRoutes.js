const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authJwt, role } = require('../middlewares');

// Middleware de diagnóstico para todas las rutas
router.use((req, res, next) => {
    console.log('\n=== DIAGNÓSTICO DE RUTA ===');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', {
        'authorization': req.headers.authorization ? '***' + req.headers.authorization.slice(-8) : null,
        'x-access-token': req.headers['x-access-token'] ? '***' + req.headers['x-access-token'].slice(-8) : null,
        'user-agent': req.headers['user-agent']
    });
    next();
});

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (admin y tesorero)
router.get('/', role.checkRole('admin', 'tesorero'), userController.getAllUsers);
router.get('/:id', role.checkRole('admin', 'tesorero'), userController.getUserById);

// Rutas de creación y modificación 
router.post('/', role.checkRole('admin', 'tesorero'), userController.createUser);

// Ruta especial para actualizar perfil propio (cualquier usuario autenticado puede actualizar su propio perfil)
router.put('/:id', (req, res, next) => {
    // Si es admin o tesorero, puede editar cualquier usuario
    if (req.userRole === 'admin' || req.userRole === 'tesorero') {
        return next();
    }
    
    // Si no es admin/tesorero, solo puede editar su propio perfil
    if (req.userId === req.params.id) {
        return next();
    }
    
    console.log(`Acceso denegado: usuario ${req.userId} (${req.userRole}) intentó editar perfil ${req.params.id}`);
    return res.status(403).json({
        success: false,
        message: 'Solo puedes editar tu propio perfil'
    });
}, userController.updateUser);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, userController.deleteUser);

module.exports = router;