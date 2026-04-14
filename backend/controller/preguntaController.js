const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Pregunta', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Consulta, ID_Usuario, Codigo_Producto, Pregunta, Fecha } = req.body;
    const sql = `INSERT INTO Pregunta VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ID_Consulta, ID_Usuario, Codigo_Producto, Pregunta, Fecha], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Pregunta creada" });
    });
};

exports.actualizar = (req, res) => {
    const { ID_Usuario, Codigo_Producto, Pregunta, Fecha, ID_Consulta } = req.body;
    const sql = `UPDATE Pregunta SET ID_Usuario=?, Codigo_Producto=?, Pregunta=?, Fecha=? WHERE ID_Consulta=?`;
    db.query(sql, [ID_Usuario, Codigo_Producto, Pregunta, Fecha, ID_Consulta], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Pregunta actualizada" });
    });
};

exports.eliminar = (req, res) => {
    db.query('DELETE FROM Pregunta WHERE ID_Consulta = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Pregunta eliminada" });
    });
};
