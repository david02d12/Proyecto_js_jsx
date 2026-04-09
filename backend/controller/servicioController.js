const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Servicio', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa } = req.body;
    const sql = `INSERT INTO Servicio (Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Guardado" });
    });
};

exports.actualizar = (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio } = req.body;
    const sql = `UPDATE Servicio SET Descripcion=?, ID_Usuario=?, Precio=?, Movil_Nombre=?, Movil_Especificacion=?, Fecha=?, Etapa=? WHERE ID_Servicio=?`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Actualizado" });
    });
};

exports.eliminar = (req, res) => {
    db.query('DELETE FROM Servicio WHERE ID_Servicio = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Eliminado" });
    });
};
