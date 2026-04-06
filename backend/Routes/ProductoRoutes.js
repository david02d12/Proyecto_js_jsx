const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');

router.get('/', ProductoController.listarProducto);
router.get('/:id', ProductoController.obtenerProducto);
router.post('/', ProductoController.crearProducto);
router.put('/:id', ProductoController.actualizarProducto);
router.delete('/:id', ProductoController.eliminarProducto); 

module.exports = router;
