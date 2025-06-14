const checkRole = (...allowedRoles) =>{
    return (req, res, next )=>{
        if(!req.userRole){
            console.error('intento de verificar rol son token valido');
            return res.status(500).json({
                success: false,
                message: 'Error al verificar rol'
            });
        }
        if (!allowedRoles.includes(req.userRole)){
            console.log(`Acceso denegado para ${req.userEmail} (${req.userRole}) en ruta ${req.originalUrl}`);
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado'
            });
        }
        next();
    };
};

//Funciones especificas de rol
const isAdmin = (req, res, next)=>{
    return checkRole('admin')(req, res, next);
};

const isTesorero = (req, res, next)=>{
    return checkRole('tesorero')(req, res, next);
};

const isParticipante= (req, res, next)=>{
    return checkRole('participante')(req, res, next);
};
const isSeminarista = (req, res, next)=>{
    return checkRole('seminarista')(req, res, next);
};
const isLogistico = (req, res, next)=>{
    return checkRole('logistico')(req, res, next);
};
const isExterno = (req, res, next)=>{
    return checkRole('externo')(req, res, next);
};

module.exports = {
    checkRole,
    isAdmin,
    isTesorero,
    isParticipante,
    isSeminarista,
    isLogistico,
    isExterno
};