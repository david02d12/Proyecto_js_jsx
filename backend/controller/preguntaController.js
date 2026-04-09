const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Producto', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria } = req.body;
    const sql = `INSERT INTO Producto VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Producto creado" });
    });
};

exports.actualizar = (req, res) => {
    const { Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria, Codigo_Producto } = req.body;
    const sql = `UPDATE Producto SET Cantidad=?, Precio=?, Nombre=?, Descripcion=?, Imagen=?, Activo_Catalogo=?, ID_Categoria=? WHERE Codigo_Producto=?`;
    db.query(sql, [Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria, Codigo_Producto], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto actualizado" });
    });
};

exports.eliminar = (req, res) => {
    db.query('DELETE FROM Producto WHERE Codigo_Producto = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto eliminado" });
    });
};
