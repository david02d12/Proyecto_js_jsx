const Categoria = require('../models/CategoriaModel');

exports.obtenerCategorias = (req, res) => {
    Categoria.getAll((err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
};

exports.crearCategoria = (req, res) => {
    Categoria.create(req.body, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ message: "Categoría creada con éxito" });
    });
};
