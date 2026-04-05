const { db } = require('../config/db');

class ChatModel {
    static listar(callback) {
        const sql = `
            SELECT 
                c.Codigo_Chat,
                c.ID_Usuario,
                c.ID_Servicio,
                u.Nombre as Nombre_Usuario,
                s.Movil_Nombre,
                s.Descripcion as Descripcion_Servicio,
                s.Etapa,
                (SELECT COUNT(*) FROM Mensaje m WHERE m.Codigo_Chat = c.Codigo_Chat AND m.Estado = 0 AND m.ID_Usuario != c.ID_Usuario) as Mensajes_Sin_Leer
            FROM Chat c
            LEFT JOIN Usuario u ON c.ID_Usuario = u.ID_Usuario
            LEFT JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
            ORDER BY Mensajes_Sin_Leer DESC, c.Codigo_Chat DESC
        `;
        db.query(sql, [], callback);
    }

    static getMensajes(idChat, callback) {
        const sql = `
            SELECT m.*, u.Nombre as Nombre_Remitente 
            FROM Mensaje m
            LEFT JOIN Usuario u ON m.ID_Usuario = u.ID_Usuario
            WHERE m.Codigo_Chat = ? 
            ORDER BY m.Fecha_Mensaje ASC
        `;
        db.query(sql, [idChat], callback);
    }

    static enviarMensaje(data, callback) {
        const { Codigo_Chat, ID_Usuario, Mensaje } = data;
        const sql = `INSERT INTO Mensaje (Codigo_Chat, ID_Usuario, Mensaje, Estado) VALUES (?, ?, ?, 0)`;
        db.query(sql, [Codigo_Chat, ID_Usuario, Mensaje], callback);
    }

    static leerMensajes(idChat, idLector, callback) {
        const sql = `UPDATE Mensaje SET Estado = 1 WHERE Codigo_Chat = ? AND ID_Usuario != ? AND Estado = 0`;
        db.query(sql, [idChat, idLector], callback);
    }
}

module.exports = ChatModel;
