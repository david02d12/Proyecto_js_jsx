const NotificacionModel = require('../models/NotificacionModel');

exports.getUsuario = (req, res) => {
    if (String(req.params.id) !== String(req.userId) && req.userRol !== 3) {
        return res.status(403).json({ error: "Permiso denegado. No puedes ver notificaciones ajenas." });
    }
    NotificacionModel.getUsuarioNotif(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getTecnico = (req, res) => {
    NotificacionModel.getTecnicoNotif((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.getAdmin = (req, res) => {
    NotificacionModel.getAdminNotif((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
