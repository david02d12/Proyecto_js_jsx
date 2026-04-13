const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Producto', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los productos.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria } = req.body;

    if (!Codigo_Producto || !Nombre || !Precio) {
        return res.status(400).json({ error: 'Los campos Codigo_Producto, Nombre y Precio son obligatorios.' });
    }

    const sql = `INSERT INTO Producto VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El producto ya existe.' });
            return res.status(500).json({ error: 'Error al crear el producto.' });
        }
        res.status(201).json({ message: 'Producto creado correctamente.' });
    });
};

exports.actualizar = (req, res) => {
    const { Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria, Codigo_Producto } = req.body;

    if (!Codigo_Producto) {
        return res.status(400).json({ error: 'El campo Codigo_Producto es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Producto SET Cantidad=?, Precio=?, Nombre=?, Descripcion=?, Imagen=?, Activo_Catalogo=?, ID_Categoria=? WHERE Codigo_Producto=?`;
    db.query(sql, [Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria, Codigo_Producto], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el producto.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado.' });
        res.status(200).json({ message: 'Producto actualizado correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El código del producto es obligatorio.' });

    db.query('DELETE FROM Producto WHERE Codigo_Producto = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el producto.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Producto no encontrado.' });
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    });
};