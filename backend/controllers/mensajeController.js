const db = require('../config/db');

// Listar todos los mensajes (generalmente se filtran por Codigo_Chat)
exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Mensajes';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Agregar un nuevo mensaje
exports.agregar = (req, res) => {
    const { Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado } = req.body;
    
    // Si no viene fecha, usamos la fecha actual
    const fecha = Fecha_Mensaje || new Date().toISOString().split('T')[0];
    
    const sql = `INSERT INTO Mensajes (Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [Codigo_Chat, ID_Usuario, fecha, Mensaje, Estado], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: "Mensaje enviado", 
            id: result.insertId 
        });
    });
};

// Actualizar un mensaje (útil para cambiar el Estado a 'leído')
exports.actualizar = (req, res) => {
    const { Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado, Codigo_Mensaje } = req.body;
    const sql = `UPDATE Mensajes SET Codigo_Chat=?, ID_Usuario=?, Fecha_Mensaje=?, Mensaje=?, Estado=? WHERE Codigo_Mensaje=?`;
    
    db.query(sql, [Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado, Codigo_Mensaje], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Mensaje actualizado" });
    });
};

// Eliminar un mensaje
exports.eliminar = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Mensajes WHERE Codigo_Mensaje = ?';
    
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Mensaje eliminado" });
    });
};