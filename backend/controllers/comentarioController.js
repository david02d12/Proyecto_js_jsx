const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Comentarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Usuario, Comentario, Fecha_Comentario } = req.body;
    
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

exports.actualizar = (req, res) => {
    const { Comentario, Fecha_Comentario, Codigo_Comentario } = req.body;
    const sql = `UPDATE Comentarios SET Comentario = ?, Fecha_Comentario = ? WHERE Codigo_Comentario = ?`;
    
    db.query(sql, [Comentario, Fecha_Comentario, Codigo_Comentario], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comentario actualizado" });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Comentarios WHERE Codigo_Comentario = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Comentario eliminado" });
    });
};