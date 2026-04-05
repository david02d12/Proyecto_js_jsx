const UsuarioModel = require('../models/UsuarioModel');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/db');

exports.registro = (req, res) => {
    UsuarioModel.registrar(req.body, err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario creado" });
    });
};

exports.login = (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    
    UsuarioModel.login(user, password, (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const u = results[0];
            const token = jwt.sign({ id: u.ID_Usuario, rol: u.Codigo_Rol }, SECRET_KEY, { expiresIn: '8h' });
            res.json({
                auth: true, 
                token,
                user: u.ID_Usuario,
                nombre: u.Nombre,
                rol: u.Codigo_Rol,
                descripcion_rol: u.Descripcion_Rol,
                correo: u.Correo
            });
        } else {
            res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
        }
    });
};

exports.cambiarContrasena = (req, res) => {
    const { actual, nueva } = req.body;
    UsuarioModel.getContrasenaActual(req.userId, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        
        if (results[0].Contraseña.trim() !== actual.trim()) {
            return res.status(400).json({ error: "La contraseña actual es incorrecta" });
        }
        
        UsuarioModel.actualizarContrasena(req.userId, nueva, (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: "Contraseña actualizada correctamente" });
        });
    });
};

exports.getPerfil = (req, res) => {
    UsuarioModel.getPerfil(req.userId, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ error: "No encontrado" });
        res.json(results[0]);
    });
};

exports.actualizarPerfil = (req, res) => {
    UsuarioModel.actualizarPerfil(req.userId, req.body, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Perfil actualizado" });
    });
};
exports.listarUsuarios = (req, res) => {
    UsuarioModel.listar((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.cambiarRol = (req, res) => {
    const { idUsuario, nuevoRol } = req.body;
    UsuarioModel.cambiarRol(idUsuario, nuevoRol, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol modificado" });
    });
};

exports.eliminarUsuario = (req, res) => {
    UsuarioModel.eliminar(req.params.id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuario eliminado" });
    });
};
