const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS
const authController = require('../controllers/authController');
const servicioController = require('../controllers/servicioController');
const rolesController = require('../controllers/rolesController');
const historialController = require('../controllers/historialController');
const tipoController = require('../controllers/tipoController');
const productoController = require('../controllers/productoController');
const categoriaController = require('../controllers/categoriaController');
const preguntaController = require('../controllers/preguntaController');
const chatController = require('../controllers/chatController');
const comentarioController = require('../controllers/comentarioController');
const mensajeController = require('../controllers/mensajeController');
const notificacionController = require('../controllers/notificacionController');

const { validarToken, validarRol } = require('../middlewares/authMiddleware');

// ─── ROLES: 1=Técnico | 2=Cliente | 3=Administrador ───────────────────────────

// AUTENTICACIÓN (pública)
router.post('/registro', authController.registro);
router.post('/login', authController.login);

// USUARIOS — 403 si no es Admin
router.get('/usuarios/listar', validarToken, validarRol(3), authController.listar);
router.put('/usuarios/actualizar', validarToken, validarRol(3), authController.actualizar);
router.delete('/usuarios/eliminar/:id', validarToken, validarRol(3), authController.eliminar);

// ROLES — listar libre; modificar solo Admin
router.get('/roles/listar', validarToken, rolesController.listarRoles);
router.post('/roles/agregar', validarToken, validarRol(3), rolesController.agregarRol);
router.put('/roles/actualizar', validarToken, validarRol(3), rolesController.actualizarRol);
router.delete('/roles/eliminar/:id', validarToken, validarRol(3), rolesController.eliminarRol);

// TIPO DOCUMENTO — listar libre; modificar solo Admin
router.get('/tipodocumento/listar', validarToken, tipoController.listarDocumentos);
router.post('/tipodocumento/agregar', validarToken, validarRol(3), tipoController.agregarDocumento);
router.put('/tipodocumento/actualizar', validarToken, validarRol(3), tipoController.actualizarDocumento);
router.delete('/tipodocumento/eliminar/:id', validarToken, validarRol(3), tipoController.eliminarDocumento);

// SERVICIOS — todos consultan; cliente puede cancelar el suyo; técnico y admin gestionan
router.get('/servicios/listar', validarToken, servicioController.listar);
router.get('/servicios/mis-servicios/:idUsuario', validarToken, servicioController.misServicios);
router.post('/servicios/agregar', validarToken, servicioController.agregar);
router.put('/servicios/actualizar', validarToken, validarRol(1, 3), servicioController.actualizar);
router.patch('/servicios/cancelar/:id', validarToken, servicioController.cancelar);
router.delete('/servicios/eliminar/:id', validarToken, validarRol(1, 3), servicioController.eliminar);

// HISTORIAL — técnico y admin gestionan
router.get('/historial/listar', validarToken, historialController.listarHistorial);
router.post('/historial/agregar', validarToken, validarRol(1, 3), historialController.agregarHistorial);
router.put('/historial/actualizar', validarToken, validarRol(1, 3), historialController.actualizarHistorial);
router.delete('/historial/eliminar/:id', validarToken, validarRol(1, 3), historialController.eliminarHistorial);

// PRODUCTOS — todos ven; Técnico y Admin modifican
router.get('/productos/listar', validarToken, productoController.listar);
router.post('/productos/agregar', validarToken, validarRol(1, 3), productoController.agregar);
router.put('/productos/actualizar', validarToken, validarRol(1, 3), productoController.actualizar);
router.delete('/productos/eliminar/:id', validarToken, validarRol(1, 3), productoController.eliminar);

// CATEGORIAS — todos ven; Técnico y Admin modifican
router.get('/categorias/listar', validarToken, categoriaController.listar);
router.post('/categorias/agregar', validarToken, validarRol(1, 3), categoriaController.agregar);
router.put('/categorias/actualizar', validarToken, validarRol(1, 3), categoriaController.actualizar);
router.delete('/categorias/eliminar/:id', validarToken, validarRol(1, 3), categoriaController.eliminar);

// PREGUNTAS — todos logueados agregan; Tecnico y Admin editan/eliminan
router.get('/preguntas/listar', validarToken, preguntaController.listar);
router.post('/preguntas/agregar', validarToken, preguntaController.agregar);
router.put('/preguntas/actualizar', validarToken, validarRol(1, 3), preguntaController.actualizar);
router.delete('/preguntas/eliminar/:id', validarToken, validarRol(1, 3), preguntaController.eliminar);

// CHATS — todos consultan; técnico y admin eliminan
router.get('/chats/listar', validarToken, chatController.listar);
router.post('/chats/agregar', validarToken, chatController.agregar);
router.put('/chats/actualizar', validarToken, chatController.actualizar);
router.delete('/chats/eliminar/:id', validarToken, validarRol(1, 3), chatController.eliminar);

// COMENTARIOS — todos escriben; dueño edita/elimina; técnico y admin editan/eliminan
router.get('/comentarios/listar', validarToken, comentarioController.listar);
router.post('/comentarios/agregar', validarToken, comentarioController.agregar);
router.put('/comentarios/actualizar', validarToken, comentarioController.actualizar);
router.delete('/comentarios/eliminar/:id', validarToken, comentarioController.eliminar);

// MENSAJES — todos envían; técnico y admin eliminan
router.get('/mensajes/listar', validarToken, mensajeController.listar);
router.post('/mensajes/agregar', validarToken, mensajeController.agregar);
router.put('/mensajes/actualizar', validarToken, mensajeController.actualizar);
router.delete('/mensajes/eliminar/:id', validarToken, validarRol(1, 3), mensajeController.eliminar);

// NOTIFICACIONES — todos ven; Técnico y Admin modifican
router.get('/notificaciones/listar', validarToken, notificacionController.listar);
router.post('/notificaciones/agregar', validarToken, validarRol(1, 3), notificacionController.agregar);
router.put('/notificaciones/actualizar', validarToken, validarRol(1, 3), notificacionController.actualizar);
router.delete('/notificaciones/eliminar/:id', validarToken, validarRol(1, 3), notificacionController.eliminar);

module.exports = router;