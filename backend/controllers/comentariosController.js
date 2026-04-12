const db = require('../config/db');

// Listar todos los comentarios
exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Comentarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Agregar un nuevo comentario
exports.agregar = (req, res) => {
    const { ID_Usuario, Comentario, Fecha_Comentario } = req.body;
    
    // Si no recibes fecha del frontend, usamos la fecha actual del servidor (YYYY-MM-DD)
    const fecha = Fecha_Comentario || new Date().toISOString().split('T')[0];
    
    const sql = `INSERT INTO Comentarios (ID_Usuario, Comentario, Fecha_Comentario) VALUES (?, ?, ?)`;
    
    db.query(sql, [ID_Usuario, Comentario, fecha], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: "Comentario publicado", 
            id: result.insertId 
        });
    });
};

// Actualizar un comentario
exports.actualizar = (req, res) => {
    const { Comentario, Fecha_Comentario, Codigo_Comentario } = req.body;
    const sql = `UPDATE Comentarios SET Comentario = ?, Fecha_Comentario = ? WHERE Codigo_Comentario = ?`;
    
    db.query(sql, [Comentario, Fecha_Comentario, Codigo_Comentario], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comentario actualizado" });
    });
};

// Eliminar un comentario
exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Comentarios WHERE Codigo_Comentario = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comentario eliminado" });
    });
};