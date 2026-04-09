const db = require('../config/db');

exports.listarDocumentos = (req, res) => {
    db.query('SELECT * FROM Tipo_Documento', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
exports.agregarDocumento = (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;
    const sql = `INSERT INTO Tipo_Documento (Codigo_Documento, Nombre_Documento) VALUES (?, ?)`;
    db.query(sql, [Codigo_Documento, Nombre_Documento], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Tipo de documento guardado" });
    });
};
exports.actualizarDocumento = (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;
    const sql = `UPDATE Tipo_Documento SET Nombre_Documento=? WHERE Codigo_Documento=?`;
    db.query(sql, [Nombre_Documento, Codigo_Documento], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Tipo de documento actualizado" });
    });
};
exports.eliminarDocumento = (req, res) => {
    db.query('DELETE FROM Tipo_Documento WHERE Codigo_Documento = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Tipo de documento eliminado" });
    });
};
