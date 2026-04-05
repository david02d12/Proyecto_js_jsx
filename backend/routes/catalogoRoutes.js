const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogoController');
const { validarToken, soloAdmin, soloStaff } = require('../middlewares/auth');
router.get('/productos/catalogo', validarToken, catalogoController.listarCatalogoActivo);
router.get('/productos/listar', validarToken, soloStaff, catalogoController.listarTodos);
router.post('/productos/agregar', validarToken, soloAdmin, catalogoController.agregar);
router.put('/productos/actualizar', validarToken, soloAdmin, catalogoController.actualizar);
router.delete('/productos/eliminar/:codigo', validarToken, soloAdmin, catalogoController.eliminar);
router.get('/categorias', validarToken, catalogoController.listarCategorias);
router.post('/preguntas/hacer', validarToken, catalogoController.hacerPregunta);
router.get('/preguntas/listar', validarToken, soloStaff, catalogoController.listarPreguntas);

module.exports = router;
