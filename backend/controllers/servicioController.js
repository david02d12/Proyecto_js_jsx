const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Servicio', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los servicios.' });
        res.status(200).json(results);
    });
};

// RF014 — Servicios del cliente autenticado
exports.misServicios = (req, res) => {
    const { idUsuario } = req.params;
    if (!idUsuario) return res.status(400).json({ error: 'El ID de usuario es obligatorio.' });

    db.query('SELECT * FROM Servicio WHERE ID_Usuario = ? ORDER BY Fecha DESC', [idUsuario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener tus servicios.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa } = req.body;

    if (!Descripcion || !ID_Usuario) {
        return res.status(400).json({ error: 'Los campos Descripcion e ID_Usuario son obligatorios.' });
    }

    const sql = `INSERT INTO Servicio (Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa || 0], (err) => {
        if (err) return res.status(500).json({ error: 'Error al registrar el servicio.' });
        res.status(201).json({ message: 'Servicio registrado correctamente.' });
    });
};

exports.actualizar = (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio } = req.body;

    if (!ID_Servicio) {
        return res.status(400).json({ error: 'El campo ID_Servicio es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Servicio SET Descripcion=?, ID_Usuario=?, Precio=?, Movil_Nombre=?, Movil_Especificacion=?, Fecha=?, Etapa=? WHERE ID_Servicio=?`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el servicio.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Servicio no encontrado.' });
        res.status(200).json({ message: 'Servicio actualizado correctamente.' });
    });
};

// RF013 / CU013 — Cancelacion controlada (PATCH). Etapa -1 = Cancelado.
exports.cancelar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del servicio es obligatorio.' });

    db.query('SELECT Etapa, ID_Usuario FROM Servicio WHERE ID_Servicio = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al consultar el servicio.' });
        if (results.length === 0) return res.status(404).json({ error: 'Servicio no encontrado.' });

        const { Etapa, ID_Usuario } = results[0];

        if (Number(Etapa) === 100) {
            return res.status(409).json({ error: 'No se puede cancelar un servicio ya completado.' });
        }
        if (Number(Etapa) === -1) {
            return res.status(409).json({ error: 'El servicio ya fue cancelado.' });
        }

        db.query('SELECT Codigo_Rol FROM Usuario WHERE ID_Usuario = ?', [req.userId], (err2, rolRes) => {
            if (err2) return res.status(500).json({ error: 'Error al verificar permisos.' });
            const rolUsuario = rolRes[0]?.Codigo_Rol;

            if (req.userId !== ID_Usuario && rolUsuario !== 1 && rolUsuario !== 3) {
                return res.status(403).json({ error: 'No tienes permiso para cancelar este servicio.' });
            }

            db.query('UPDATE Servicio SET Etapa = -1 WHERE ID_Servicio = ?', [id], (err3, result) => {
                if (err3) return res.status(500).json({ error: 'Error al cancelar el servicio.' });
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Servicio no encontrado.' });
                res.status(200).json({ message: 'Servicio cancelado correctamente.' });
            });
        });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del servicio es obligatorio.' });

    db.query('DELETE FROM Servicio WHERE ID_Servicio = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el servicio.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Servicio no encontrado.' });
        res.status(200).json({ message: 'Servicio eliminado correctamente.' });
    });
};