const db = require('../config/db');

exports.listarDocumentos = (req, res) => {
    db.query('SELECT * FROM Tipo_Documento', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los tipos de documento.' });
        res.status(200).json(results);
    });
};

exports.agregarDocumento = (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;

    if (!Codigo_Documento || !Nombre_Documento) {
        return res.status(400).json({ error: 'Los campos Codigo_Documento y Nombre_Documento son obligatorios.' });
    }

    const sql = `INSERT INTO Tipo_Documento (Codigo_Documento, Nombre_Documento) VALUES (?, ?)`;
    db.query(sql, [Codigo_Documento, Nombre_Documento], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El tipo de documento ya existe.' });
            return res.status(500).json({ error: 'Error al crear el tipo de documento.' });
        }
        res.status(201).json({ message: 'Tipo de documento creado correctamente.' });
    });
};

exports.actualizarDocumento = (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;

    if (!Codigo_Documento || !Nombre_Documento) {
        return res.status(400).json({ error: 'Los campos Codigo_Documento y Nombre_Documento son obligatorios.' });
    }

    const sql = `UPDATE Tipo_Documento SET Nombre_Documento=? WHERE Codigo_Documento=?`;
    db.query(sql, [Nombre_Documento, Codigo_Documento], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el tipo de documento.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo de documento no encontrado.' });
        res.status(200).json({ message: 'Tipo de documento actualizado correctamente.' });
    });
};

exports.eliminarDocumento = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del tipo de documento es obligatorio.' });

    db.query('DELETE FROM Tipo_Documento WHERE Codigo_Documento = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el tipo de documento.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Tipo de documento no encontrado.' });
        res.status(200).json({ message: 'Tipo de documento eliminado correctamente.' });
    });
};