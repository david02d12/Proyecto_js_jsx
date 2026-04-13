const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Chat';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los chats.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Usuario, ID_Servicio } = req.body;

    if (!ID_Usuario || !ID_Servicio) {
        return res.status(400).json({ error: 'Los campos ID_Usuario e ID_Servicio son obligatorios.' });
    }

    const sql = `INSERT INTO Chat (ID_Usuario, ID_Servicio) VALUES (?, ?)`;
    db.query(sql, [ID_Usuario, ID_Servicio], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al crear el chat.' });
        res.status(201).json({ message: 'Chat creado correctamente.', id: result.insertId });
    });
};

exports.actualizar = (req, res) => {
    const { ID_Usuario, ID_Servicio, Codigo_Chat } = req.body;

    if (!Codigo_Chat) {
        return res.status(400).json({ error: 'El campo Codigo_Chat es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Chat SET ID_Usuario = ?, ID_Servicio = ? WHERE Codigo_Chat = ?`;
    db.query(sql, [ID_Usuario, ID_Servicio, Codigo_Chat], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el chat.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Chat no encontrado.' });
        res.status(200).json({ message: 'Chat actualizado correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del chat es obligatorio.' });

    const sql = 'DELETE FROM Chat WHERE Codigo_Chat = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el chat.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Chat no encontrado.' });
        res.status(200).json({ message: 'Chat eliminado correctamente.' });
    });
};