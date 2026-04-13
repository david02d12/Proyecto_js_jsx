const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Pregunta', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las preguntas.' });
        res.status(200).json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Consulta, ID_Usuario, Codigo_Producto, Pregunta, Fecha } = req.body;

    if (!ID_Usuario || !Codigo_Producto || !Pregunta) {
        return res.status(400).json({ error: 'Los campos ID_Usuario, Codigo_Producto y Pregunta son obligatorios.' });
    }

    db.query('SELECT Codigo_Rol FROM Usuario WHERE ID_Usuario = ?', [req.userId], (errRol, resRol) => {
        const miRol = resRol && resRol.length > 0 ? resRol[0].Codigo_Rol : 2;
        if (ID_Usuario !== req.userId && miRol !== 1 && miRol !== 3) {
            return res.status(403).json({ error: 'Acceso denegado: IDOR bloqueado (Intento de pregunta ajena).' });
        }

        const sql = `INSERT INTO Pregunta VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [ID_Consulta, ID_Usuario, Codigo_Producto, Pregunta, Fecha], (err) => {
            if (err) return res.status(500).json({ error: 'Error al registrar la pregunta.' });
            res.status(201).json({ message: 'Pregunta registrada correctamente.' });
        });
    });
};

exports.actualizar = (req, res) => {
    const { ID_Usuario, Codigo_Producto, Pregunta, Fecha, ID_Consulta } = req.body;

    if (!ID_Consulta) {
        return res.status(400).json({ error: 'El campo ID_Consulta es obligatorio para actualizar.' });
    }

    const sql = `UPDATE Pregunta SET ID_Usuario=?, Codigo_Producto=?, Pregunta=?, Fecha=? WHERE ID_Consulta=?`;
    db.query(sql, [ID_Usuario, Codigo_Producto, Pregunta, Fecha, ID_Consulta], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la pregunta.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pregunta no encontrada.' });
        res.status(200).json({ message: 'Pregunta actualizada correctamente.' });
    });
};

exports.eliminar = (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'El ID de la consulta es obligatorio.' });

    db.query('DELETE FROM Pregunta WHERE ID_Consulta = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la pregunta.' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Pregunta no encontrada.' });
        res.status(200).json({ message: 'Pregunta eliminada correctamente.' });
    });
};