const { db } = require('../config/db');

class ServicioModel {
    static listar(callback) {
        const sql = `SELECT s.*, u.Nombre as Nombre_Cliente 
                     FROM Servicio s 
                     LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario 
                     ORDER BY s.ID_Servicio DESC`;
        db.query(sql, [], callback);
    }

    static getById(idServicio, callback) {
        const sqlSrv = `SELECT s.*, u.Nombre as Nombre_Cliente 
                        FROM Servicio s 
                        LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario 
                        WHERE s.ID_Servicio = ?`;
        const sqlHist = `SELECT * FROM Historial_Servicio WHERE ID_Servicio = ? ORDER BY Fecha_Evento DESC`;

        db.query(sqlSrv, [idServicio], (err, resultsSrv) => {
            if (err) return callback(err, null);
            if (resultsSrv.length === 0) return callback(null, null);

            db.query(sqlHist, [idServicio], (errH, resultsHist) => {
                if (errH) return callback(errH, null);
                const servicio = resultsSrv[0];
                servicio.historial = resultsHist || [];
                callback(null, servicio);
            });
        });
    }

    static agregar(data, callback) {
        const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa } = data;
        const sql = `INSERT INTO Servicio (Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa || 0], (err, result) => {
            if (err) return callback(err, null);
            
            const insertId = result.insertId;
            const sqlHist = `INSERT INTO Historial_Servicio (ID_Servicio, Descripcion_Evento, Transicion_Etapa, Estado)
                             VALUES (?, 'Creación de la orden de servicio', ?, 1)`;
            db.query(sqlHist, [insertId, `${Etapa || 0}%`], () => {
                const sqlChat = `INSERT INTO Chat (ID_Usuario, ID_Servicio) VALUES (?, ?)`;
                db.query(sqlChat, [ID_Usuario, insertId], () => {
                    callback(null, result);
                });
            });
        });
    }

    static actualizar(data, callback) {
        const { Descripcion, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio } = data;
        
        db.query("SELECT Etapa FROM Servicio WHERE ID_Servicio = ?", [ID_Servicio], (err, results) => {
            if (err) return callback(err, null);
            const etapaAnterior = results.length > 0 ? results[0].Etapa : 0;
            const desc = Descripcion ? Descripcion : '';

            const sql = `UPDATE Servicio SET Descripcion=?, Precio=?, Movil_Nombre=?, Movil_Especificacion=?, Fecha=?, Etapa=? WHERE ID_Servicio=?`;
            const params = [desc, Precio || 0, Movil_Nombre || '', Movil_Especificacion || '', Fecha || null, Etapa || 0, ID_Servicio];

            db.query(sql, params, (errUpdate) => {
                if (errUpdate) return callback(errUpdate, null);
                
                if (etapaAnterior !== (Etapa || 0)) {
                    const sqlHist = `INSERT INTO Historial_Servicio (ID_Servicio, Descripcion_Evento, Transicion_Etapa, Estado)
                                     VALUES (?, 'Actualización de etapa del servicio a ${Etapa}%', ?, 1)`;
                    db.query(sqlHist, [ID_Servicio, `${etapaAnterior}% -> ${Etapa}%`], () => {
                        callback(null, { message: "Servicio actualizado con historial" });
                    });
                } else {
                    callback(null, { message: "Servicio actualizado" });
                }
            });
        });
    }

    static eliminar(idServicio, callback) {
        const deleteMsg = `DELETE FROM Mensaje WHERE Codigo_Chat IN (SELECT Codigo_Chat FROM Chat WHERE ID_Servicio = ?)`;
        const deleteChat = `DELETE FROM Chat WHERE ID_Servicio = ?`;
        const deleteHist = `DELETE FROM Historial_Servicio WHERE ID_Servicio = ?`;
        const deleteSrv = `DELETE FROM Servicio WHERE ID_Servicio = ?`;

        db.query(deleteMsg, [idServicio], () => {
            db.query(deleteChat, [idServicio], () => {
                db.query(deleteHist, [idServicio], () => {
                    db.query(deleteSrv, [idServicio], callback);
                });
            });
        });
    }
}

module.exports = ServicioModel;
