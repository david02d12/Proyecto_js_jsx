const ChatModel = require('../models/ChatModel');

exports.listar = (req, res) => {
    ChatModel.listar((err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.getMensajes = (req, res) => {
    ChatModel.getMensajes(req.params.idChat, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.enviar = (req, res) => {
    ChatModel.enviarMensaje(req.body, (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Mensaje guardado" });
    });
};

exports.leer = (req, res) => {
    const { idChat } = req.params;
    const { idUsuario } = req.body;
    
    ChatModel.leerMensajes(idChat, idUsuario, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Mensajes marcados como leídos" });
    });
};
