const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authMiddleware');

//CONTROLADORES DE AUTENTICACIÓN

exports.registro = async (req, res) => {
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Codigo_Rol } = req.body;
    const saltRounds = 10;
    
    try {
        const hashedClave = await bcrypt.hash(Clave, saltRounds);
        // Rol por defecto 3
        const rolAsignado = Codigo_Rol || 3;

        const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña, Codigo_Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave, rolAsignado], (err) => {
            if (err) {
                console.error("Error al insertar:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Usuario creado" });
        });
    } catch (error) {
        res.status(500).json({ error: "Error al cifrar la clave" });
    }
};

exports.login = (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    const sql = "SELECT * FROM Usuario WHERE TRIM(ID_Usuario) = ?";
    db.query(sql, [user], async (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].Contraseña);
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

//CONTROLADORES CRUD

exports.listar = (req, res) => {
    const sql = 'SELECT ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Codigo_Rol FROM Usuario';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.actualizar = async (req, res) => {
    const { Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Codigo_Rol, ID_Usuario } = req.body;
    
    let sql = "";
    let params = [];

    if (Clave) {
        const hashedClave = await bcrypt.hash(Clave, 10);
        sql = `UPDATE Usuario SET Codigo_Documento=?, Nombre=?, Fecha_Nacimiento=?, Direccion=?, Telefono=?, Correo=?, Contraseña=?, Codigo_Rol=? WHERE ID_Usuario=?`;
        params = [Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave, Codigo_Rol, ID_Usuario];
    } else {
        sql = `UPDATE Usuario SET Codigo_Documento=?, Nombre=?, Fecha_Nacimiento=?, Direccion=?, Telefono=?, Correo=?, Codigo_Rol=? WHERE ID_Usuario=?`;
        params = [Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Codigo_Rol, ID_Usuario];
    }

    db.query(sql, params, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario actualizado correctamente" });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Usuario WHERE ID_Usuario = ?';
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario eliminado" });
    });
};
