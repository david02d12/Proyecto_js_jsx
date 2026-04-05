const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { validarToken, soloStaff, soloAdmin } = require('../middlewares/auth');

router.get('/listar', validarToken, servicioController.listar);
router.get('/:id', validarToken, servicioController.obtenerDetalle);
router.post('/agregar', validarToken, soloAdmin, servicioController.agregar);
router.put('/actualizar', validarToken, soloStaff, servicioController.actualizar);
router.delete('/eliminar/:id', validarToken, soloAdmin, servicioController.eliminar);

module.exports = router;
