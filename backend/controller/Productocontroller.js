const Producto = require('../models/Productosmodels');

const ProductoController = {
    listarProducto: (req, res) => {
        const { nombre } = req.query; 
        Producto.listarProducto(nombre, (err, results) => {
            if (err) {
                console.error("Error al listar:", err);
                return res.status(500).json({ error: "Error al obtener la lista de productos" });
            }
            res.json(results);
        });
    },

    obtenerProducto: (req, res) => {
        const { id } = req.params;
        Producto.obtenerProducto(id, (err, result) => {
            if (err) return res.status(500).json({ error: "Error al buscar el producto" });
            
            if (result.length === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }
            res.json(result[0]);
        });
    },

    crearProducto: (req, res) => {
        const data = req.body;
        if (!data.Nombre || !data.Precio || !data.id_Producto) {
            return res.status(400).json({ mensaje: "ID, Nombre y Precio son obligatorios" });
        }

        Producto.crearProducto(data, (err, result) => {
            if (err) {
                console.error("Error al crear:", err);
                return res.status(500).json({ error: "No se pudo registrar el producto. Verifique si el ID ya existe." });
            }
            res.status(201).json({ 
                success: true,
                mensaje: "Producto agregado con éxito a CeluAccel", 
                id: result.insertId 
            });
        });
    },

    actualizarProducto: (req, res) => {
        const { id } = req.params;
        const data = req.body;

        if (!id) return res.status(400).json({ mensaje: "ID de producto requerido" });

        Producto.actualizarProducto(id, data, (err, result) => {
            if (err) {
                console.error("Error al actualizar:", err);
                return res.status(500).json({ error: "Error al actualizar los datos" });
            }
            res.json({ success: true, mensaje: "Producto actualizado correctamente" });
        });
    },

    eliminarProducto: (req, res) => {
        const { id } = req.params;

        Producto.eliminarProducto(id, (err, result) => {
            if (err) {
                console.error("Error al eliminar:", err);
                return res.status(500).json({ error: "No se pudo eliminar el producto" });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "El producto no existe" });
            }

            res.json({ success: true, mensaje: "Producto eliminado del inventario" });
        });
    }
};

module.exports = ProductoController;
