const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarToken, soloAdmin } = require('../middlewares/auth');

router.post('/registro', authController.registro);
router.post('/login', authController.login);

router.put('/perfil/cambiar-contrasena', validarToken, authController.cambiarContrasena);
router.get('/perfil', validarToken, authController.getPerfil);
router.put('/perfil', validarToken, authController.actualizarPerfil);
router.get('/usuarios/listar', validarToken, soloAdmin, authController.listarUsuarios);
router.put('/usuarios/cambiar-rol', validarToken, soloAdmin, authController.cambiarRol);
router.delete('/usuarios/eliminar/:id', validarToken, soloAdmin, authController.eliminarUsuario);

module.exports = router;
