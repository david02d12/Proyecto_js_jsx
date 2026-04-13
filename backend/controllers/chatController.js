const db = require('../config/db');

// Listar TODOS los chats (solo admins y técnicos)
exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Chat';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los chats.' });
        res.status(200).json(results);
    });
};

// Listar solo los chats del usuario autenticado (clientes)
// Se basa en los servicios que pertenecen al usuario, no solo en Chat.ID_Usuario
exports.listarMios = (req, res) => {
    const idUsuario = req.userId;
    if (!idUsuario) return res.status(401).json({ error: 'Usuario no autenticado.' });

    // JOIN con Servicio para incluir chats aunque ID_Usuario en Chat no coincida exactamente
    const sql = `
        SELECT c.* FROM Chat c
        INNER JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
        WHERE TRIM(s.ID_Usuario) = TRIM(?)
        UNION
        SELECT * FROM Chat WHERE TRIM(ID_Usuario) = TRIM(?)
    `;
    db.query(sql, [idUsuario, idUsuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener tus chats.' });
        // Eliminar duplicados por Codigo_Chat
        const vistos = new Set();
        const unicos = results.filter(r => {
            if (vistos.has(r.Codigo_Chat)) return false;
            vistos.add(r.Codigo_Chat);
            return true;
        });
        res.status(200).json(unicos);
    });
};

exports.agregar = (req, res) => {
    const { ID_Usuario, ID_Servicio } = req.body;

    if (!ID_Usuario || !ID_Servicio) {
        return res.status(400).json({ error: 'Los campos ID_Usuario e ID_Servicio son obligatorios.' });
    }

    // Evitar chats duplicados para el mismo servicio
    db.query('SELECT Codigo_Chat FROM Chat WHERE ID_Servicio = ?', [ID_Servicio], (errCheck, existing) => {
        if (errCheck) return res.status(500).json({ error: 'Error al verificar chat existente.' });
        if (existing.length > 0) {
            return res.status(200).json({ message: 'Ya existe un chat para este servicio.', id: existing[0].Codigo_Chat, existente: true });
        }

        const sql = `INSERT INTO Chat (ID_Usuario, ID_Servicio) VALUES (?, ?)`;
        db.query(sql, [ID_Usuario, ID_Servicio], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al crear el chat.' });
            res.status(201).json({ message: 'Chat creado correctamente.', id: result.insertId });
        });
    });
};

exports.actualizar = (req, res) => {
    const { ID_Usuario, ID_Servicio, Codigo_Chat } = req.body;

    if (!Codigo_Chat) {
        return res.status(400).json({ error: 'El campo Codigo_Chat es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Chat SET ID_Usuario = ?, ID_Servicio = ? WHERE Codigo_Chat = ?`;
    db.query(sql, [ID_Usuario, ID_Servicio, Codigo_Chat], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el chat.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Chat no encontrado.' });
        res.status(200).json({ message: 'Chat actualizado correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del chat es obligatorio.' });

    const sql = 'DELETE FROM Chat WHERE Codigo_Chat = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el chat.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Chat no encontrado.' });
        res.status(200).json({ message: 'Chat eliminado correctamente.' });
    });
};