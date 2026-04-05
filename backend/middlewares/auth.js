const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/db');
const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ mensaje: "Token faltante" });
    }
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: "Token inválido" });
        req.userId = decoded.id;
        req.userRol = decoded.rol;
        next();
    });
};
const soloStaff = (req, res, next) => {
    if (req.userRol === 2) {
        return res.status(403).json({ mensaje: "Sin permisos. Acceso solo para personal técnico o administradores." });
    }
    next();
};
const soloAdmin = (req, res, next) => {
    if (req.userRol !== 3) {
        return res.status(403).json({ mensaje: "Sin permisos. Requiere privilegios de administrador." });
    }
    next();
};

module.exports = {
    validarToken,
    soloStaff,
    soloAdmin
};
