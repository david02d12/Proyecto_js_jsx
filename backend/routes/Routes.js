const express = require('express');
const router = express.Router();

// IMPORTACION DE CONTROLLERS (COLOCAR LOS CONTROLLERS NUEVOS AQUI)
const authController = require('../controllers/authController');
const servicioController = require('../controllers/servicioController');
const rolesController = require('../controllers/rolesController');
const historialController = require('../controllers/historialController');
const tipoController = require('../controllers/tipoController');
const productoController = require('../controllers/productoController');
const categoriaController = require('../controllers/categoriaController');
const preguntaController = require('../controllers/preguntaController');

// NUEVOS CONTROLLERS
const chatController = require('../controllers/chatController');
const comentarioController = require('../controllers/comentarioController');
const mensajeController = require('../controllers/mensajeController');
const notificacionController = require('../controllers/notificacionController');

const { validarToken } = require('../middlewares/authMiddleware');

// RUTAS DE AUTENTIFICACION Y USUARIOS
router.post('/registro', authController.registro);
router.post('/login', authController.login);
router.get('/usuarios/listar', validarToken, authController.listar);
router.put('/usuarios/actualizar', validarToken, authController.actualizar);
router.delete('/usuarios/eliminar/:id', validarToken, authController.eliminar);

// Servicios
router.get('/servicios/listar', validarToken, servicioController.listar);
router.post('/servicios/agregar', validarToken, servicioController.agregar);
router.put('/servicios/actualizar', validarToken, servicioController.actualizar);
router.delete('/servicios/eliminar/:id', validarToken, servicioController.eliminar);

// Roles
router.get('/roles/listar', validarToken, rolesController.listarRoles);
router.post('/roles/agregar', validarToken, rolesController.agregarRol);
router.put('/roles/actualizar', validarToken, rolesController.actualizarRol);
router.delete('/roles/eliminar/:id', validarToken, rolesController.eliminarRol);

// Historial
router.get('/historial/listar', validarToken, historialController.listarHistorial);
router.post('/historial/agregar', validarToken, historialController.agregarHistorial);
router.put('/historial/actualizar', validarToken, historialController.actualizarHistorial);
router.delete('/historial/eliminar/:id', validarToken, historialController.eliminarHistorial);

// Tipo Documento
router.get('/tipodocumento/listar', validarToken, tipoController.listarDocumentos);
router.post('/tipodocumento/agregar', validarToken, tipoController.agregarDocumento);
router.put('/tipodocumento/actualizar', validarToken, tipoController.actualizarDocumento);
router.delete('/tipodocumento/eliminar/:id', validarToken, tipoController.eliminarDocumento);

// Productos
router.get('/productos/listar', validarToken, productoController.listar);
router.post('/productos/agregar', validarToken, productoController.agregar);
router.put('/productos/actualizar', validarToken, productoController.actualizar);
router.delete('/productos/eliminar/:id', validarToken, productoController.eliminar);

// Categorías
router.get('/categorias/listar', validarToken, categoriaController.listar);
router.post('/categorias/agregar', validarToken, categoriaController.agregar);
router.put('/categorias/actualizar', validarToken, categoriaController.actualizar);
router.delete('/categorias/eliminar/:id', validarToken, categoriaController.eliminar);

// Preguntas
router.get('/preguntas/listar', validarToken, preguntaController.listar);
router.post('/preguntas/agregar', validarToken, preguntaController.agregar);
router.put('/preguntas/actualizar', validarToken, preguntaController.actualizar);
router.delete('/preguntas/eliminar/:id', validarToken, preguntaController.eliminar);

// Chats
router.get('/chats/listar', validarToken, chatController.listar);
router.post('/chats/agregar', validarToken, chatController.agregar);
router.put('/chats/actualizar', validarToken, chatController.actualizar);
router.delete('/chats/eliminar/:id', validarToken, chatController.eliminar);

// Comentarios
router.get('/comentarios/listar', validarToken, comentarioController.listar);
router.post('/comentarios/agregar', validarToken, comentarioController.agregar);
router.put('/comentarios/actualizar', validarToken, comentarioController.actualizar);
router.delete('/comentarios/eliminar/:id', validarToken, comentarioController.eliminar);

// Mensajes
router.get('/mensajes/listar', validarToken, mensajeController.listar);
router.post('/mensajes/agregar', validarToken, mensajeController.agregar);
router.put('/mensajes/actualizar', validarToken, mensajeController.actualizar);
router.delete('/mensajes/eliminar/:id', validarToken, mensajeController.eliminar);

// Notificaciones
router.get('/notificaciones/listar', validarToken, notificacionController.listar);
router.post('/notificaciones/agregar', validarToken, notificacionController.agregar);
router.put('/notificaciones/actualizar', validarToken, notificacionController.actualizar);
router.delete('/notificaciones/eliminar/:id', validarToken, notificacionController.eliminar);

module.exports = router;