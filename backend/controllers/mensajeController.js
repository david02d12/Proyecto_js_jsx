const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Mensajes';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los mensajes.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado } = req.body;

    if (!Codigo_Chat || !ID_Usuario || !Mensaje) {
        return res.status(400).json({ error: 'Los campos Codigo_Chat, ID_Usuario y Mensaje son obligatorios.' });
    }

    const fecha = Fecha_Mensaje || new Date().toISOString().split('T')[0];

    const sql = `INSERT INTO Mensajes (Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [Codigo_Chat, ID_Usuario, fecha, Mensaje, Estado], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al enviar el mensaje.' });
        res.status(201).json({ message: 'Mensaje enviado correctamente.', id: result.insertId });
    });
};

exports.actualizar = (req, res) => {
    const { Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado, Codigo_Mensaje } = req.body;

    if (!Codigo_Mensaje) {
        return res.status(400).json({ error: 'El campo Codigo_Mensaje es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Mensajes SET Codigo_Chat=?, ID_Usuario=?, Fecha_Mensaje=?, Mensaje=?, Estado=? WHERE Codigo_Mensaje=?`;
    db.query(sql, [Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado, Codigo_Mensaje], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el mensaje.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Mensaje no encontrado.' });
        res.status(200).json({ message: 'Mensaje actualizado correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del mensaje es obligatorio.' });

    const sql = 'DELETE FROM Mensajes WHERE Codigo_Mensaje = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el mensaje.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Mensaje no encontrado.' });
        res.status(200).json({ message: 'Mensaje eliminado correctamente.' });
    });
};