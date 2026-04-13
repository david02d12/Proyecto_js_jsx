const db = require('../config/db');

// Listar todas (admin/tecnico - catálogo de tipos)
exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Notificaciones ORDER BY Codigo_Notificaciones DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las notificaciones.' });
        res.status(200).json(results);
    });
};

// ─── NOTIFICACIONES DIRIGIDAS AL CLIENTE ────────────────────────────────────

// Técnico envía una notificación a un cliente específico
exports.enviar = (req, res) => {
    const { ID_Usuario_Destino, ID_Servicio, Mensaje } = req.body;

    if (!ID_Usuario_Destino || !Mensaje) {
        return res.status(400).json({ error: 'ID_Usuario_Destino y Mensaje son obligatorios.' });
    }

    // Guardamos como JSON en Tipo_Notificacion para no alterar el esquema de BD
    const payload = JSON.stringify({
        para: ID_Usuario_Destino,
        servicio: ID_Servicio || null,
        texto: Mensaje,
        leida: false,
        fecha: new Date().toISOString().split('T')[0],
        de: req.userId
    });

    const sql = 'INSERT INTO Notificaciones (Tipo_Notificacion) VALUES (?)';
    db.query(sql, [payload], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al enviar la notificacion.' });
        res.status(201).json({ message: 'Notificaci\u00f3n enviada al cliente.', id: result.insertId });
    });
};

// Cliente consulta sus propias notificaciones
exports.misNotificaciones = (req, res) => {
    const idUsuario = req.userId;
    if (!idUsuario) return res.status(401).json({ error: 'Usuario no autenticado.' });

    db.query('SELECT * FROM Notificaciones ORDER BY Codigo_Notificaciones DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener notificaciones.' });

        // Filtrar solo las que tienen payload JSON y van dirigidas a este usuario
        const mias = results
            .filter(n => {
                try {
                    const p = JSON.parse(n.Tipo_Notificacion);
                    return p && p.para && String(p.para).trim() === String(idUsuario).trim();
                } catch { return false; }
            })
            .map(n => {
                const p = JSON.parse(n.Tipo_Notificacion);
                return { ...n, parsed: p };
            });

        res.status(200).json(mias);
    });
};

// Marcar notificación como leída
exports.marcarLeida = (req, res) => {
    const { id } = req.params;
    db.query('SELECT Tipo_Notificacion FROM Notificaciones WHERE Codigo_Notificaciones = ?', [id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ error: 'Notificaci\u00f3n no encontrada.' });
        try {
            const p = JSON.parse(rows[0].Tipo_Notificacion);
            // Verificar que la notificacion sea para este usuario
            if (String(p.para).trim() !== String(req.userId).trim()) {
                return res.status(403).json({ error: 'Acceso denegado.' });
            }
            p.leida = true;
            db.query('UPDATE Notificaciones SET Tipo_Notificacion = ? WHERE Codigo_Notificaciones = ?',
                [JSON.stringify(p), id],
                (err2) => {
                    if (err2) return res.status(500).json({ error: 'Error al actualizar.' });
                    res.status(200).json({ message: 'Marcada como le\u00edda.' });
                });
        } catch {
            res.status(400).json({ error: 'Formato de notificaci\u00f3n inv\u00e1lido.' });
        }
    });
};

// ─── CRUD de catálogo (tipos) ─────────────────────────────────────────────────

exports.agregar = (req, res) => {
    const { Codigo_Notificaciones, Tipo_Notificacion } = req.body;

    if (!Codigo_Notificaciones || !Tipo_Notificacion) {
        return res.status(400).json({ error: 'Los campos Codigo_Notificaciones y Tipo_Notificacion son obligatorios.' });
    }

    const sql = `INSERT INTO Notificaciones (Codigo_Notificaciones, Tipo_Notificacion) VALUES (?, ?)`;
    db.query(sql, [Codigo_Notificaciones, Tipo_Notificacion], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'La notificaci\u00f3n ya existe.' });
            return res.status(500).json({ error: 'Error al crear la notificaci\u00f3n.' });
        }
        res.status(201).json({ message: 'Notificaci\u00f3n creada correctamente.' });
    });
};

exports.actualizar = (req, res) => {
    const { Tipo_Notificacion, Codigo_Notificaciones } = req.body;

    if (!Codigo_Notificaciones) {
        return res.status(400).json({ error: 'El campo Codigo_Notificaciones es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Notificaciones SET Tipo_Notificacion = ? WHERE Codigo_Notificaciones = ?`;
    db.query(sql, [Tipo_Notificacion, Codigo_Notificaciones], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la notificaci\u00f3n.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificaci\u00f3n no encontrada.' });
        res.status(200).json({ message: 'Notificaci\u00f3n actualizada correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID de la notificaci\u00f3n es obligatorio.' });

    const sql = 'DELETE FROM Notificaciones WHERE Codigo_Notificaciones = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la notificaci\u00f3n.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Notificaci\u00f3n no encontrada.' });
        res.status(200).json({ message: 'Notificaci\u00f3n eliminada correctamente.' });
    });
};