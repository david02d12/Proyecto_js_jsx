const db = require('../config/db');

// Listar todas las notificaciones
exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Notificaciones';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Agregar una nueva notificación
exports.agregar = (req, res) => {
    // Al no ser auto_increment, el Codigo_Notificaciones debe venir en el body
    const { Codigo_Notificaciones, Tipo_Notificacion } = req.body;
    const sql = `INSERT INTO Notificaciones (Codigo_Notificaciones, Tipo_Notificacion) VALUES (?, ?)`;
    
    db.query(sql, [Codigo_Notificaciones, Tipo_Notificacion], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Notificación creada con éxito" });
    });
};

// Actualizar una notificación
exports.actualizar = (req, res) => {
    const { Tipo_Notificacion, Codigo_Notificaciones } = req.body;
    const sql = `UPDATE Notificaciones SET Tipo_Notificacion = ? WHERE Codigo_Notificaciones = ?`;
    
    db.query(sql, [Tipo_Notificacion, Codigo_Notificaciones], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notificación actualizada" });
    });
};

// Eliminar una notificación
exports.eliminar = (req, res) => {
    const { id } = req.params; // Se espera el Codigo_Notificaciones en la URL
    const sql = 'DELETE FROM Notificaciones WHERE Codigo_Notificaciones = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Notificación eliminada" });
    });
};