const { db } = require('../config/db');

class CatalogoModel {
    static listarActivos(callback) {
        const sql = `SELECT p.*, c.Nombre_Categoria 
                     FROM Producto p 
                     LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria 
                     WHERE p.Activo_Catalogo = 1`;
        db.query(sql, [], callback);
    }

    static listarTodos(callback) {
        const sql = `SELECT p.*, c.Nombre_Categoria 
                     FROM Producto p 
                     LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria`;
        db.query(sql, [], callback);
    }

    static agregar(data, callback) {
        const { Codigo_Producto, Nombre, Descripcion, Precio, Cantidad, Activo_Catalogo, ID_Categoria } = data;
        const sql = `INSERT INTO Producto (Codigo_Producto, Nombre, Descripcion, Precio, Cantidad, Imagen, Activo_Catalogo, ID_Categoria)
                     VALUES (?, ?, ?, ?, ?, 'default.png', ?, ?)`;
        db.query(sql, [Codigo_Producto, Nombre, Descripcion, Precio, Cantidad, Activo_Catalogo || 1, ID_Categoria], callback);
    }

    static actualizar(data, callback) {
        const { Codigo_Producto, Nombre, Descripcion, Precio, Cantidad, Activo_Catalogo, ID_Categoria } = data;
        const sql = `UPDATE Producto 
                     SET Nombre=?, Descripcion=?, Precio=?, Cantidad=?, Activo_Catalogo=?, ID_Categoria=? 
                     WHERE Codigo_Producto=?`;
        db.query(sql, [Nombre, Descripcion, Precio, Cantidad, Activo_Catalogo, ID_Categoria, Codigo_Producto], callback);
    }

    static eliminar(codigo, callback) {
        const sql = 'DELETE FROM Producto WHERE Codigo_Producto = ?';
        db.query(sql, [codigo], callback);
    }
    static listarCategorias(callback) {
        const sql = 'SELECT * FROM Categoria';
        db.query(sql, [], callback);
    }
    static hacerPregunta(data, callback) {
        const { Codigo_Producto, Pregunta } = data;
        const { ID_Usuario } = data; 
        const sql = `INSERT INTO Preguntas_Producto (Codigo_Producto, ID_Usuario, Pregunta, Fecha) 
                     VALUES (?, ?, ?, NOW())`;
        db.query(sql, [Codigo_Producto, ID_Usuario, Pregunta], callback);
    }

    static listarPreguntas(callback) {
        const sql = `SELECT pp.*, u.Nombre as Nombre_Usuario, p.Nombre as Nombre_Producto 
                     FROM Preguntas_Producto pp
                     LEFT JOIN Usuario u ON pp.ID_Usuario = u.ID_Usuario
                     LEFT JOIN Producto p ON pp.Codigo_Producto = p.Codigo_Producto
                     ORDER BY pp.Fecha DESC`;
        db.query(sql, [], callback);
    }
}

module.exports = CatalogoModel;
