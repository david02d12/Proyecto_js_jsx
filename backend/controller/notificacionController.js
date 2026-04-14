const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Notificaciones';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { Codigo_Notificaciones, Tipo_Notificacion } = req.body;
    const sql = `INSERT INTO Notificaciones (Codigo_Notificaciones, Tipo_Notificacion) VALUES (?, ?)`;
    
    db.query(sql, [Codigo_Notificaciones, Tipo_Notificacion], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Notificación creada con éxito" });
    });
};

exports.actualizar = (req, res) => {
    const { Tipo_Notificacion, Codigo_Notificaciones } = req.body;
    const sql = `UPDATE Notificaciones SET Tipo_Notificacion = ? WHERE Codigo_Notificaciones = ?`;
    
    db.query(sql, [Tipo_Notificacion, Codigo_Notificaciones], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notificación actualizada" });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Notificaciones WHERE Codigo_Notificaciones = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notificación eliminada" });
    });
};
