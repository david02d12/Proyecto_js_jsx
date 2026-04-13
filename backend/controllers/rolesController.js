const db = require('../config/db');

exports.listarRoles = (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los roles.' });
        res.status(200).json(results);
    });
};

exports.agregarRol = (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;

    if (!Codigo_Rol || !Descripcion_Rol) {
        return res.status(400).json({ error: 'Los campos Codigo_Rol y Descripcion_Rol son obligatorios.' });
    }

    const sql = `INSERT INTO Roles (Codigo_Rol, Descripcion_Rol) VALUES (?, ?)`;
    db.query(sql, [Codigo_Rol, Descripcion_Rol], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El rol ya existe.' });
            return res.status(500).json({ error: 'Error al crear el rol.' });
        }
        res.status(201).json({ message: 'Rol creado correctamente.' });
    });
};

exports.actualizarRol = (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;

    if (!Codigo_Rol || !Descripcion_Rol) {
        return res.status(400).json({ error: 'Los campos Codigo_Rol y Descripcion_Rol son obligatorios.' });
    }

    const sql = `UPDATE Roles SET Descripcion_Rol=? WHERE Codigo_Rol=?`;
    db.query(sql, [Descripcion_Rol, Codigo_Rol], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el rol.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado.' });
        res.status(200).json({ message: 'Rol actualizado correctamente.' });
    });
};

exports.eliminarRol = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID del rol es obligatorio.' });

    db.query('DELETE FROM Roles WHERE Codigo_Rol = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el rol.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Rol no encontrado.' });
        res.status(200).json({ message: 'Rol eliminado correctamente.' });
    });
};