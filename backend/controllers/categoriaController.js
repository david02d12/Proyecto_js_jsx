const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Categoria', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las categorías.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Categoria, Nombre_Categoria } = req.body;

    if (!ID_Categoria || !Nombre_Categoria) {
        return res.status(400).json({ error: 'Los campos ID_Categoria y Nombre_Categoria son obligatorios.' });
    }

    db.query('INSERT INTO Categoria VALUES (?, ?)', [ID_Categoria, Nombre_Categoria], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'La categoría ya existe.' });
            return res.status(500).json({ error: 'Error al crear la categoría.' });
        }
        res.status(201).json({ message: 'Categoría creada correctamente.' });
    });
};

exports.actualizar = (req, res) => {
    const { Nombre_Categoria, ID_Categoria } = req.body;

    if (!ID_Categoria || !Nombre_Categoria) {
        return res.status(400).json({ error: 'Los campos ID_Categoria y Nombre_Categoria son obligatorios.' });
    }

    db.query('UPDATE Categoria SET Nombre_Categoria=? WHERE ID_Categoria=?', [Nombre_Categoria, ID_Categoria], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la categoría.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada.' });
        res.status(200).json({ message: 'Categoría actualizada correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID de la categoría es obligatorio.' });

    db.query('DELETE FROM Categoria WHERE ID_Categoria = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la categoría.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Categoría no encontrada.' });
        res.status(200).json({ message: 'Categoría eliminada correctamente.' });
    });
};