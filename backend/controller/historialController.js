const db = require('../config/db');

exports.listarHistorial = (req, res) => {
    db.query('SELECT * FROM Historial_Servicios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
exports.agregarHistorial = (req, res) => {
    const { ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado } = req.body;
    const sql = `INSERT INTO Historial_Servicios (ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Historial registrado" });
    });
};
exports.actualizarHistorial = (req, res) => {
    const { ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial } = req.body;
    const sql = `UPDATE Historial_Servicios SET ID_Servicio=?, Fecha_Evento=?, Descripcion_Evento=?, Estado=? WHERE ID_Historial=?`;
    db.query(sql, [ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Historial actualizado" });
    });
};
exports.eliminarHistorial = (req, res) => {
    db.query('DELETE FROM Historial_Servicios WHERE ID_Historial = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Historial eliminado" });
    });
};
