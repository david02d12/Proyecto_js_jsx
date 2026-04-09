const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authMiddleware');

//CONTROLADOR DEL REGISTRO DE UN USUARIO

exports.registro = async (req, res) => {
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave } = req.body;
    const saltRounds = 10;
    const hashedClave = await bcrypt.hash(Clave, saltRounds);

    const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Admin')`;
    db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario creado" });
    });
};

//CONTROLADOR DEL INICIO DE SESION DE UN USUARIO
exports.login = (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    const sql = "SELECT * FROM Usuario WHERE TRIM(ID_Usuario) = ?";
    db.query(sql, [user], async (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].Clave);
            if (match) {
                const token = jwt.sign({ id: results[0].ID_Usuario }, SECRET_KEY, { expiresIn: '2h' });
                res.json({ auth: true, token, user: results[0].ID_Usuario });
            } else {
                res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
            }
        } else {
            res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
        }
    });
};