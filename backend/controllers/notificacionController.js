const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Notificaciones';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { Codigo_Notificaciones, Tipo_Notificacion } = req.body;

    if (!Codigo_Notificaciones || !Tipo_Notificacion) {
        return res.status(400).json({ error: 'Los campos Codigo_Notificaciones y Tipo_Notificacion son obligatorios.' });
    }

    const sql = `INSERT INTO Notificaciones (Codigo_Notificaciones, Tipo_Notificacion) VALUES (?, ?)`;
    db.query(sql, [Codigo_Notificaciones, Tipo_Notificacion], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'La notificación ya existe.' });
            return res.status(500).json({ error: 'Error al crear la notificación.' });
        }
        res.status(201).json({ message: 'Notificación creada correctamente.' });
    });
};

exports.actualizar = (req, res) => {
    const { Tipo_Notificacion, Codigo_Notificaciones } = req.body;

    if (!Codigo_Notificaciones) {
        return res.status(400).json({ error: 'El campo Codigo_Notificaciones es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Notificaciones SET Tipo_Notificacion = ? WHERE Codigo_Notificaciones = ?`;
    db.query(sql, [Tipo_Notificacion, Codigo_Notificaciones], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la notificación.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificación no encontrada.' });
        res.status(200).json({ message: 'Notificación actualizada correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID de la notificación es obligatorio.' });

    const sql = 'DELETE FROM Notificaciones WHERE Codigo_Notificaciones = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la notificación.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificación no encontrada.' });
        res.status(200).json({ message: 'Notificación eliminada correctamente.' });
    });
};