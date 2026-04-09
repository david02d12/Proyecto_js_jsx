const jwt = require('jsonwebtoken');
const SECRET_KEY = "mi_clave";


//AUTENTICAR EL TOKEN DE INICIO DE SESION
const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) return res.status(401).json({ mensaje: "Token faltante" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: "Token inválido" });
        req.userId = decoded.id;
        next();
    });
};

module.exports = { validarToken, SECRET_KEY };