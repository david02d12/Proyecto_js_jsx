const CatalogoModel = require('../models/CatalogoModel');

exports.listarCatalogoActivo = (req, res) => {
    CatalogoModel.listarActivos((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.listarTodos = (req, res) => {
    CatalogoModel.listarTodos((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.agregar = (req, res) => {
    CatalogoModel.agregar(req.body, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Producto agregado" });
    });
};

exports.actualizar = (req, res) => {
    CatalogoModel.actualizar(req.body, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto actualizado" });
    });
};

exports.eliminar = (req, res) => {
    CatalogoModel.eliminar(req.params.codigo, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto eliminado" });
    });
};

exports.listarCategorias = (req, res) => {
    CatalogoModel.listarCategorias((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.hacerPregunta = (req, res) => {
    const params = {
        ...req.body,
        ID_Usuario: req.userId 
    };
    CatalogoModel.hacerPregunta(params, (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Pregunta registrada" });
    });
};

exports.listarPreguntas = (req, res) => {
    CatalogoModel.listarPreguntas((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};
