const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Comentarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los comentarios.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Usuario, Comentario, Fecha_Comentario } = req.body;

    if (!ID_Usuario || !Comentario) {
        return res.status(400).json({ error: 'Los campos ID_Usuario y Comentario son obligatorios.' });
    }

    const fecha = Fecha_Comentario || new Date().toISOString().split('T')[0];
    const sql = `INSERT INTO Comentarios (ID_Usuario, Comentario, Fecha_Comentario) VALUES (?, ?, ?)`;

    db.query(sql, [ID_Usuario, Comentario, fecha], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al publicar el comentario.' });
        res.status(201).json({ message: 'Comentario publicado correctamente.', id: result.insertId });
    });
};

exports.actualizar = (req, res) => {
    const { Comentario, Fecha_Comentario, Codigo_Comentario } = req.body;

    if (!Codigo_Comentario) {
        return res.status(400).json({ error: 'El campo Codigo_Comentario es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Comentarios SET Comentario = ?, Fecha_Comentario = ? WHERE Codigo_Comentario = ?`;
    db.query(sql, [Comentario, Fecha_Comentario, Codigo_Comentario], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el comentario.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Comentario no encontrado.' });
        res.status(200).json({ message: 'Comentario actualizado correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del comentario es obligatorio.' });

    const sql = 'DELETE FROM Comentarios WHERE Codigo_Comentario = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el comentario.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Comentario no encontrado.' });
        res.status(200).json({ message: 'Comentario eliminado correctamente.' });
    });
};