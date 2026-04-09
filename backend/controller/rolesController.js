const db = require('../config/db');

exports.listarRoles = (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
exports.agregarRol = (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;
    const sql = `INSERT INTO Roles (Codigo_Rol, Descripcion_Rol) VALUES (?, ?)`;
    db.query(sql, [Codigo_Rol, Descripcion_Rol], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Rol guardado" });
    });
};
exports.actualizarRol = (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;
    const sql = `UPDATE Roles SET Descripcion_Rol=? WHERE Codigo_Rol=?`;
    db.query(sql, [Descripcion_Rol, Codigo_Rol], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol actualizado" });
    });
};
exports.eliminarRol = (req, res) => {
    db.query('DELETE FROM Roles WHERE Codigo_Rol = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol eliminado" });
    });
};
