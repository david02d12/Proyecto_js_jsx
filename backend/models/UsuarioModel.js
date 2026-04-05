const { db } = require('../config/db');

class UsuarioModel {
    static registrar(data, callback) {
        const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña } = data;
        const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña, Codigo_Rol)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2)`;
        db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña], callback);
    }

    static login(user, password, callback) {
        const sql = `SELECT u.*, r.Descripcion_Rol, td.Nombre_Documento
                     FROM Usuario u
                     LEFT JOIN Roles r ON u.Codigo_Rol = r.Codigo_Rol
                     LEFT JOIN Tipo_Documento td ON u.Codigo_Documento = td.Codigo_Documento
                     WHERE TRIM(u.ID_Usuario) = ? AND TRIM(u.Contraseña) = ?`;
        db.query(sql, [user, password], callback);
    }

    static getContrasenaActual(idUsuario, callback) {
        const sql = 'SELECT Contraseña FROM Usuario WHERE ID_Usuario = ?';
        db.query(sql, [idUsuario], callback);
    }

    static actualizarContrasena(idUsuario, nueva, callback) {
        const sql = 'UPDATE Usuario SET Contraseña = ? WHERE ID_Usuario = ?';
        db.query(sql, [nueva, idUsuario], callback);
    }

    static getPerfil(idUsuario, callback) {
        const sql = `SELECT ID_Usuario as id, Nombre, Correo, Telefono, Direccion, Codigo_Rol as rol 
                     FROM Usuario WHERE ID_Usuario = ?`;
        db.query(sql, [idUsuario], callback);
    }

    static actualizarPerfil(idUsuario, data, callback) {
        const { nombre, correo, telefono, direccion } = data;
        const sql = `UPDATE Usuario SET Nombre=?, Correo=?, Telefono=?, Direccion=? WHERE ID_Usuario=?`;
        db.query(sql, [nombre, correo, telefono, direccion, idUsuario], callback);
    }

    static listar(callback) {
        const sql = `SELECT u.ID_Usuario, u.Nombre, u.Correo, u.Codigo_Rol, td.Nombre_Documento 
                     FROM Usuario u 
                     LEFT JOIN Tipo_Documento td ON u.Codigo_Documento = td.Codigo_Documento`;
        db.query(sql, [], callback);
    }

    static cambiarRol(idUsuario, nuevoRol, callback) {
        const sql = 'UPDATE Usuario SET Codigo_Rol = ? WHERE ID_Usuario = ?';
        db.query(sql, [nuevoRol, idUsuario], callback);
    }

    static eliminar(idUsuario, callback) {
        const sql = 'DELETE FROM Usuario WHERE ID_Usuario = ?';
        db.query(sql, [idUsuario], callback);
    }
}

module.exports = UsuarioModel;
