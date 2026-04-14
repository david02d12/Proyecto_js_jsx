const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Chat';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};


exports.agregar = (req, res) => {
    const { ID_Usuario, ID_Servicio } = req.body;
    
    const sql = `INSERT INTO Chat (ID_Usuario, ID_Servicio) VALUES (?, ?)`;
    
    db.query(sql, [ID_Usuario, ID_Servicio], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: "Chat creado con éxito", 
            id: result.insertId 
        });
    });
};

exports.actualizar = (req, res) => {
    const { ID_Usuario, ID_Servicio, Codigo_Chat } = req.body;
    const sql = `UPDATE Chat SET ID_Usuario = ?, ID_Servicio = ? WHERE Codigo_Chat = ?`;
    
    db.query(sql, [ID_Usuario, ID_Servicio, Codigo_Chat], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Chat actualizado correctamente" });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Chat WHERE Codigo_Chat = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Chat eliminado con éxito" });
    });
};
