const db = require('../config/db');

exports.listarHistorial = (req, res) => {
    db.query('SELECT * FROM Historial_Servicios', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener el historial.' });
        res.status(200).json(results);
    });
};

exports.agregarHistorial = (req, res) => {
    const { ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado } = req.body;

    if (!ID_Servicio || !Descripcion_Evento) {
        return res.status(400).json({ error: 'Los campos ID_Servicio y Descripcion_Evento son obligatorios.' });
    }

    const sql = `INSERT INTO Historial_Servicios (ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado], (err) => {
        if (err) return res.status(500).json({ error: 'Error al registrar en el historial.' });
        res.status(201).json({ message: 'Historial registrado correctamente.' });
    });
};

exports.actualizarHistorial = (req, res) => {
    const { ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial } = req.body;

    if (!ID_Historial) {
        return res.status(400).json({ error: 'El campo ID_Historial es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Historial_Servicios SET ID_Servicio=?, Fecha_Evento=?, Descripcion_Evento=?, Estado=? WHERE ID_Historial=?`;
    db.query(sql, [ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el historial.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro de historial no encontrado.' });
        res.status(200).json({ message: 'Historial actualizado correctamente.' });
    });
};

exports.eliminarHistorial = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del historial es obligatorio.' });

    db.query('DELETE FROM Historial_Servicios WHERE ID_Historial = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el historial.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro de historial no encontrado.' });
        res.status(200).json({ message: 'Historial eliminado correctamente.' });
    });
};