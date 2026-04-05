const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { validarToken, soloStaff, soloAdmin } = require('../middlewares/auth');
router.get('/admin', validarToken, soloAdmin, notificacionController.getAdmin);
router.get('/tecnico', validarToken, soloStaff, notificacionController.getTecnico);
router.get('/usuario/:id', validarToken, notificacionController.getUsuario);

module.exports = router;
