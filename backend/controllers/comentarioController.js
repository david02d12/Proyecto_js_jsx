const db = require('../config/db');

exports.listar = (req, res) => {
    const sql = 'SELECT * FROM Comentarios';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los comentarios.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Usuario, Comentario, Fecha_Comentario } = req.body;

    if (!ID_Usuario || !Comentario) {
        return res.status(400).json({ error: 'Los campos ID_Usuario y Comentario son obligatorios.' });
    }

    const fecha = Fecha_Comentario || new Date().toISOString().split('T')[0];
    const sql = `INSERT INTO Comentarios (ID_Usuario, Comentario, Fecha_Comentario) VALUES (?, ?, ?)`;

    db.query(sql, [ID_Usuario, Comentario, fecha], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al publicar el comentario.' });
        res.status(201).json({ message: 'Comentario publicado correctamente.', id: result.insertId });
    });
};

exports.actualizar = (req, res) => {
    const { Comentario, Fecha_Comentario, Codigo_Comentario } = req.body;

    if (!Codigo_Comentario) {
        return res.status(400).json({ error: 'El campo Codigo_Comentario es obligatorio.' });
    }

    db.query('SELECT ID_Usuario FROM Comentarios WHERE Codigo_Comentario = ?', [Codigo_Comentario], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al verificar propiedad.' });
        if (results.length === 0) return res.status(404).json({ error: 'Comentario no encontrado.' });

        const ownerId = results[0].ID_Usuario;

        db.query('SELECT Codigo_Rol FROM Usuario WHERE ID_Usuario = ?', [req.userId], (err2, rolRes) => {
            if (err2 || rolRes.length === 0) return res.status(500).json({ error: 'Error de verificación de permisos.' });
            const rol = rolRes[0].Codigo_Rol;

            if (req.userId !== ownerId && rol !== 1 && rol !== 3) {
                return res.status(403).json({ error: 'Vulnerabilidad bloqueada: No puedes editar reseñas de otros clientes.' });
            }

            const fecha = Fecha_Comentario || new Date().toISOString().split('T')[0];
            const sql = `UPDATE Comentarios SET Comentario = ?, Fecha_Comentario = ? WHERE Codigo_Comentario = ?`;
            db.query(sql, [Comentario, fecha, Codigo_Comentario], (err3, result) => {
                if (err3) return res.status(500).json({ error: 'Error al actualizar.' });
                res.status(200).json({ message: 'Comentario actualizado correctamente.' });
            });
        });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del comentario es obligatorio.' });

    db.query('SELECT ID_Usuario FROM Comentarios WHERE Codigo_Comentario = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al verificar propiedad.' });
        if (results.length === 0) return res.status(404).json({ error: 'Comentario no encontrado.' });

        const ownerId = results[0].ID_Usuario;

        db.query('SELECT Codigo_Rol FROM Usuario WHERE ID_Usuario = ?', [req.userId], (err2, rolRes) => {
            if (err2 || rolRes.length === 0) return res.status(500).json({ error: 'Error de verificación de permisos.' });
            const rol = rolRes[0].Codigo_Rol;

            if (req.userId !== ownerId && rol !== 1 && rol !== 3) {
                return res.status(403).json({ error: 'Vulnerabilidad bloqueada: No puedes borrar reseñas de otros clientes.' });
            }

            db.query('DELETE FROM Comentarios WHERE Codigo_Comentario = ?', [id], (err3, result) => {
                if (err3) return res.status(500).json({ error: 'Error al eliminar.' });
                res.status(200).json({ message: 'Comentario eliminado.' });
            });
        });
    });
};