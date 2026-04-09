const db = require('../config/db');

exports.listar = (req, res) => {
    db.query('SELECT * FROM Categoria', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    const { ID_Categoria, Nombre_Categoria } = req.body;
    db.query('INSERT INTO Categoria VALUES (?, ?)', [ID_Categoria, Nombre_Categoria], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Categoría creada" });
    });
};

exports.actualizar = (req, res) => {
    const { Nombre_Categoria, ID_Categoria } = req.body;
    db.query('UPDATE Categoria SET Nombre_Categoria=? WHERE ID_Categoria=?', [Nombre_Categoria, ID_Categoria], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Categoría actualizada" });
    });
};

exports.eliminar = (req, res) => {
    db.query('DELETE FROM Categoria WHERE ID_Categoria = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Categoría eliminada" });
    });
};
