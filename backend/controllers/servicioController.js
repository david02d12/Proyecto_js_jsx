const ServicioModel = require('../models/ServicioModel');

exports.listar = (req, res) => {
    ServicioModel.listar((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.obtenerDetalle = (req, res) => {
    ServicioModel.getById(req.params.id, (err, result) => {
        if (err) return res.status(500).json(err);
        if (!result) return res.status(404).json({ error: "Servicio no encontrado" });
        res.json(result);
    });
};

exports.agregar = (req, res) => {
    ServicioModel.agregar(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Servicio agregado", id: result.insertId });
    });
};

exports.actualizar = (req, res) => {
    ServicioModel.actualizar(req.body, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};

exports.eliminar = (req, res) => {
    ServicioModel.eliminar(req.params.id, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Servicio eliminado" });
    });
};
