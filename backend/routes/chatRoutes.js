const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validarToken } = require('../middlewares/auth');

router.get('/chat/listar', validarToken, chatController.listar);
router.get('/mensajes/:idChat', validarToken, chatController.getMensajes);
router.post('/mensajes/enviar', validarToken, chatController.enviar);
router.put('/mensajes/leer/:idChat', validarToken, chatController.leer);

module.exports = router;
