const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middlewares/authMiddleware');

//CONTROLADORES DE AUTENTICACIÓN

exports.registro = async (req, res) => {
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Codigo_Rol } = req.body;

    if (!ID_Usuario || !Nombre || !Correo || !Clave) {
        return res.status(400).json({ error: 'Los campos ID_Usuario, Nombre, Correo y Clave son obligatorios.' });
    }

    const saltRounds = 10;
    try {
        const hashedClave = await bcrypt.hash(Clave, saltRounds);
        const rolAsignado = Codigo_Rol || 3;

        const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña, Codigo_Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave, rolAsignado], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'El usuario ya existe en el sistema.' });
                }
                console.error('Error al insertar:', err.message);
                return res.status(500).json({ error: 'Error interno al crear el usuario.' });
            }
            res.status(201).json({ message: 'Usuario creado exitosamente.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
};

exports.login = (req, res) => {
    const user = req.body.user ? req.body.user.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    if (!user || !password) {
        return res.status(400).json({ auth: false, message: 'Usuario y contraseña son obligatorios.' });
    }

    const sql = 'SELECT * FROM Usuario WHERE TRIM(ID_Usuario) = ?';
    db.query(sql, [user], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error interno del servidor.' });

        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].Contraseña);
            if (match) {
                const token = jwt.sign({ id: results[0].ID_Usuario }, SECRET_KEY, { expiresIn: '2h' });
                return res.status(200).json({ auth: true, token, user: results[0].ID_Usuario });
            }
        }
        res.status(401).json({ auth: false, message: 'Credenciales incorrectas.' });
    });
};

//CONTROLADORES CRUD

exports.listar = (req, res) => {
    const sql = 'SELECT ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Codigo_Rol FROM Usuario';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los usuarios.' });
        res.status(200).json(results);
    });
};

exports.actualizar = async (req, res) => {
    const { Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Codigo_Rol, ID_Usuario } = req.body;

    if (!ID_Usuario) {
        return res.status(400).json({ error: 'El campo ID_Usuario es obligatorio para actualizar.' });
    }

    let sql = '';
    let params = [];

    try {
        if (Clave) {
            const hashedClave = await bcrypt.hash(Clave, 10);
            sql = `UPDATE Usuario SET Codigo_Documento=?, Nombre=?, Fecha_Nacimiento=?, Direccion=?, Telefono=?, Correo=?, Contraseña=?, Codigo_Rol=? WHERE ID_Usuario=?`;
            params = [Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave, Codigo_Rol, ID_Usuario];
        } else {
            sql = `UPDATE Usuario SET Codigo_Documento=?, Nombre=?, Fecha_Nacimiento=?, Direccion=?, Telefono=?, Correo=?, Codigo_Rol=? WHERE ID_Usuario=?`;
            params = [Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Codigo_Rol, ID_Usuario];
        }

        db.query(sql, params, (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar el usuario.' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
            res.status(200).json({ message: 'Usuario actualizado correctamente.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al procesar la solicitud.' });
    }
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del usuario es obligatorio.' });

    const sql = 'DELETE FROM Usuario WHERE ID_Usuario = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el usuario.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    });
};