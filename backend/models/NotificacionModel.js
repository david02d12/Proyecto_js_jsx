const { db } = require('../config/db');

class NotificacionModel {
    static getUsuarioNotif(idUsuario, callback) {
        const notificaciones = [];
        const q1 = `
            SELECT c.Codigo_Chat, s.Movil_Nombre, 
                (SELECT COUNT(*) FROM Mensaje m WHERE m.Codigo_Chat = c.Codigo_Chat AND m.Estado=0 AND m.ID_Usuario != ?) as no_leidos
            FROM Chat c
            JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
            WHERE c.ID_Usuario = ?
        `;
        db.query(q1, [idUsuario, idUsuario], (err, res1) => {
            if (!err) {
                res1.forEach(c => {
                    if (c.no_leidos > 0) {
                        notificaciones.push({
                            id: `chat_${c.Codigo_Chat}`,
                            tipo: 'Nuevo Mensaje',
                            titulo: 'Nuevo mensaje recibido',
                            descripcion: `Tienes ${c.no_leidos} mensaje(s) nuevo(s) sobre: ${c.Movil_Nombre}`,
                            fecha: new Date(),
                            leido: false,
                            chatId: c.Codigo_Chat
                        });
                    }
                });
            }
            const q2 = `SELECT ID_Servicio, Movil_Nombre, Etapa, Fecha FROM Servicio WHERE ID_Usuario = ?`;
            db.query(q2, [idUsuario], (err, res2) => {
                if (!err) {
                    res2.forEach(s => {
                        let t = 'Actualización en tu servicio';
                        let desc = `El equipo ${s.Movil_Nombre} está en proceso.`;
                        if (s.Etapa === 0) { t = 'Servicio Recibido'; desc = `Equipo ${s.Movil_Nombre} listo para revisión.`; }
                        if (s.Etapa >= 100) { t = 'Servicio Finalizado'; desc = `Equipo ${s.Movil_Nombre} reparado y listo para entrega.`; }
                        
                        notificaciones.push({
                            id: `srv_${s.ID_Servicio}_${s.Etapa}`,
                            tipo: 'Servicio',
                            titulo: t,
                            descripcion: desc,
                            fecha: s.Fecha,
                            etapa: s.Etapa,
                            leido: s.Etapa >= 100
                        });
                    });
                }
                
                notificaciones.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
                callback(null, notificaciones);
            });
        });
    }

    static getTecnicoNotif(callback) {
        const notifs = [];
        const q1 = `
            SELECT c.Codigo_Chat, c.ID_Usuario, s.Movil_Nombre, 
                (SELECT COUNT(*) FROM Mensaje m WHERE m.Codigo_Chat = c.Codigo_Chat AND m.Estado=0 AND m.ID_Usuario = c.ID_Usuario) as no_leidos
            FROM Chat c
            JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
        `;
        db.query(q1, [], (err, res1) => {
            if (!err) {
                res1.forEach(c => {
                    if (c.no_leidos > 0) {
                        notifs.push({
                            id: `chat_${c.Codigo_Chat}`,
                            tipo: 'Nuevo Mensaje de Cliente',
                            titulo: `Cliente espera respuesta`,
                            descripcion: `El cliente con CC ${c.ID_Usuario} escribió ${c.no_leidos} mensaje(s) sobre ${c.Movil_Nombre}`,
                            fecha: new Date(),
                            leido: false,
                            chatId: c.Codigo_Chat
                        });
                    }
                });
            }

            const q2 = `SELECT ID_Servicio, Movil_Nombre, Fecha FROM Servicio WHERE Etapa < 40`;
            db.query(q2, [], (err, res2) => {
                if (!err) {
                    res2.forEach(s => {
                        notifs.push({
                            id: `srv_pen_${s.ID_Servicio}`,
                            tipo: 'Servicio Pendiente',
                            titulo: 'Servicio por iniciar',
                            descripcion: `El equipo ${s.Movil_Nombre} (Orden ${s.ID_Servicio}) se encuentra con progreso bajo (0-39%).`,
                            fecha: s.Fecha,
                            leido: false
                        });
                    });
                }
                notifs.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
                callback(null, notifs);
            });
        });
    }

    static getAdminNotif(callback) {
        const sql = `SELECT * FROM Preguntas_Producto ORDER BY Fecha DESC LIMIT 50`;
        db.query(sql, [], (err, res) => {
            if (err) return callback(err, null);
            const notifs = res.map(p => ({
                id: `preg_${p.ID_Pregunta}`,
                tipo: 'Pregunta Catálogo',
                titulo: 'Nueva duda en producto',
                descripcion: `Pregunta sobre Prod-${p.Codigo_Producto}: "${p.Pregunta}"`,
                fecha: p.Fecha,
                leido: false
            }));
            callback(null, notifs);
        });
    }
}

module.exports = NotificacionModel;
