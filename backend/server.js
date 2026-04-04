const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'celuaccel'
});

db.connect(err => {
    if (err) console.error("Error MySQL:", err.message);
    else console.log("Conectado a MySQL correctamente.");
});

const SECRET_KEY = "mi_clave";

// ─── MIDDLEWARE JWT ───────────────────────────────────────────────────────────
const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ mensaje: "Token faltante" });
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: "Token inválido" });
        req.userId = decoded.id;
        req.userRol = decoded.rol;
        next();
    });
};

// Solo admins y técnicos
const soloStaff = (req, res, next) => {
    if (req.userRol === 2) return res.status(403).json({ mensaje: "Sin permisos" });
    next();
};

// Solo admin
const soloAdmin = (req, res, next) => {
    if (req.userRol !== 3) return res.status(403).json({ mensaje: "Solo administradores" });
    next();
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

app.post('/api/registro', (req, res) => {
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña } = req.body;
    const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña, Codigo_Rol)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2)`;
    db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Contraseña], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario creado" });
    });
});

app.post('/api/login', (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";
    const sql = `SELECT u.*, r.Descripcion_Rol, td.Nombre_Documento
                 FROM Usuario u
                 LEFT JOIN Roles r ON u.Codigo_Rol = r.Codigo_Rol
                 LEFT JOIN Tipo_Documento td ON u.Codigo_Documento = td.Codigo_Documento
                 WHERE TRIM(u.ID_Usuario) = ? AND TRIM(u.Contraseña) = ?`;
    db.query(sql, [user, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            const u = results[0];
            const token = jwt.sign({ id: u.ID_Usuario, rol: u.Codigo_Rol }, SECRET_KEY, { expiresIn: '8h' });
            res.json({
                auth: true, token,
                user: u.ID_Usuario,
                nombre: u.Nombre,
                rol: u.Codigo_Rol,
                descripcion_rol: u.Descripcion_Rol,
                correo: u.Correo
            });
        } else {
            res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
        }
    });
});

// Cambiar contraseña
app.put('/api/perfil/cambiar-contrasena', validarToken, (req, res) => {
    const { actual, nueva } = req.body;
    db.query('SELECT Contraseña FROM Usuario WHERE ID_Usuario = ?', [req.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        if (results[0].Contraseña.trim() !== actual.trim())
            return res.status(400).json({ error: "La contraseña actual es incorrecta" });
        db.query('UPDATE Usuario SET Contraseña = ? WHERE ID_Usuario = ?', [nueva, req.userId], (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: "Contraseña actualizada correctamente" });
        });
    });
});

// Obtener perfil propio
app.get('/api/perfil', validarToken, (req, res) => {
    const sql = `SELECT u.ID_Usuario, u.Nombre, u.Correo, u.Telefono, u.Direccion,
                        u.Fecha_Nacimiento, u.Codigo_Rol, r.Descripcion_Rol,
                        td.Nombre_Documento, u.Codigo_Documento
                 FROM Usuario u
                 LEFT JOIN Roles r ON u.Codigo_Rol = r.Codigo_Rol
                 LEFT JOIN Tipo_Documento td ON u.Codigo_Documento = td.Codigo_Documento
                 WHERE u.ID_Usuario = ?`;
    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0] || {});
    });
});

// Actualizar perfil
app.put('/api/perfil/actualizar', validarToken, (req, res) => {
    const { Nombre, Correo, Telefono, Direccion } = req.body;
    const sql = 'UPDATE Usuario SET Nombre=?, Correo=?, Telefono=?, Direccion=? WHERE ID_Usuario=?';
    db.query(sql, [Nombre, Correo, Telefono, Direccion, req.userId], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Perfil actualizado" });
    });
});

// ─── USUARIOS (Admin) ─────────────────────────────────────────────────────────

app.get('/api/usuarios/listar', validarToken, soloAdmin, (req, res) => {
    const sql = `SELECT u.ID_Usuario, u.Nombre, u.Correo, u.Telefono, u.Codigo_Rol,
                        r.Descripcion_Rol, td.Nombre_Documento
                 FROM Usuario u
                 LEFT JOIN Roles r ON u.Codigo_Rol = r.Codigo_Rol
                 LEFT JOIN Tipo_Documento td ON u.Codigo_Documento = td.Codigo_Documento
                 ORDER BY u.Codigo_Rol, u.Nombre ASC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.delete('/api/usuarios/eliminar/:id', validarToken, soloAdmin, (req, res) => {
    if (req.params.id === req.userId) return res.status(400).json({ error: "No puedes eliminarte a ti mismo" });
    db.query('DELETE FROM Usuario WHERE ID_Usuario = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Usuario eliminado" });
    });
});

app.put('/api/usuarios/cambiar-rol', validarToken, soloAdmin, (req, res) => {
    const { idUsuario, nuevoRol } = req.body;
    db.query('UPDATE Usuario SET Codigo_Rol = ? WHERE ID_Usuario = ?', [nuevoRol, idUsuario], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol actualizado" });
    });
});

// ─── SERVICIOS ────────────────────────────────────────────────────────────────

app.get('/api/servicios/listar', validarToken, (req, res) => {
    const sql = `SELECT s.*, u.Nombre AS Nombre_Cliente
                 FROM Servicio s
                 LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario
                 ORDER BY s.ID_Servicio DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/servicios/:id', validarToken, (req, res) => {
    const sql = `SELECT s.*, u.Nombre AS Nombre_Cliente
                 FROM Servicio s
                 LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario
                 WHERE s.ID_Servicio = ?`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ mensaje: "No encontrado" });
        const servicio = results[0];
        db.query('SELECT * FROM Historial_Servicios WHERE ID_Servicio = ? ORDER BY Fecha_Evento ASC', [req.params.id], (err2, historial) => {
            if (err2) return res.status(500).json(err2);
            res.json({ ...servicio, historial });
        });
    });
});

app.post('/api/servicios/agregar', validarToken, soloStaff, (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa } = req.body;
    const sql = `INSERT INTO Servicio (Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa || 0], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Servicio creado", id: result.insertId });
    });
});

app.put('/api/servicios/actualizar', validarToken, soloStaff, (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio } = req.body;
    const sql = `UPDATE Servicio SET Descripcion=?, ID_Usuario=?, Precio=?, Movil_Nombre=?, Movil_Especificacion=?, Fecha=?, Etapa=?
                 WHERE ID_Servicio=?`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Servicio actualizado" });
    });
});

app.delete('/api/servicios/eliminar/:id', validarToken, soloAdmin, (req, res) => {
    db.query('DELETE FROM Servicio WHERE ID_Servicio = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Servicio eliminado" });
    });
});

// ─── CHAT ─────────────────────────────────────────────────────────────────────

app.get('/api/chat/listar', validarToken, (req, res) => {
    const sql = `SELECT c.*, u.Nombre AS Nombre_Usuario, s.Movil_Nombre,
                        s.Descripcion AS Descripcion_Servicio, s.Etapa,
                        (SELECT COUNT(*) FROM Mensajes m WHERE m.Codigo_Chat = c.Codigo_Chat AND m.Estado = 0) AS Mensajes_Sin_Leer
                 FROM Chat c
                 LEFT JOIN Usuario u ON c.ID_Usuario = u.ID_Usuario
                 LEFT JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
                 ORDER BY c.Codigo_Chat DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/chat/crear', validarToken, (req, res) => {
    const { ID_Usuario, ID_Servicio } = req.body;
    db.query('SELECT * FROM Chat WHERE ID_Servicio = ?', [ID_Servicio], (err, existing) => {
        if (err) return res.status(500).json(err);
        if (existing.length > 0) return res.json({ message: "Ya existe", chat: existing[0] });
        db.query('INSERT INTO Chat (ID_Usuario, ID_Servicio) VALUES (?, ?)', [ID_Usuario, ID_Servicio], (err2, result) => {
            if (err2) return res.status(500).json(err2);
            res.status(201).json({ message: "Chat creado", Codigo_Chat: result.insertId });
        });
    });
});

// ─── MENSAJES ─────────────────────────────────────────────────────────────────

app.get('/api/mensajes/:codigoChat', validarToken, (req, res) => {
    const sql = `SELECT m.*, u.Nombre AS Nombre_Remitente
                 FROM Mensajes m
                 LEFT JOIN Usuario u ON m.ID_Usuario = u.ID_Usuario
                 WHERE m.Codigo_Chat = ?
                 ORDER BY m.Codigo_Mensaje ASC`;
    db.query(sql, [req.params.codigoChat], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/mensajes/enviar', validarToken, (req, res) => {
    const { Codigo_Chat, ID_Usuario, Mensaje } = req.body;
    const Fecha_Mensaje = new Date().toISOString().split('T')[0];
    db.query('INSERT INTO Mensajes (Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje, Estado) VALUES (?, ?, ?, ?, 0)',
        [Codigo_Chat, ID_Usuario, Fecha_Mensaje, Mensaje], (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: "Enviado", id: result.insertId });
        });
});

app.put('/api/mensajes/leer/:codigoChat', validarToken, (req, res) => {
    const { idUsuario } = req.body;
    db.query('UPDATE Mensajes SET Estado = 1 WHERE Codigo_Chat = ? AND ID_Usuario != ?',
        [req.params.codigoChat, idUsuario], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Leídos" });
        });
});

app.delete('/api/mensajes/eliminar/:id', validarToken, (req, res) => {
    db.query('DELETE FROM Mensajes WHERE Codigo_Mensaje = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Mensaje eliminado" });
    });
});

// ─── NOTIFICACIONES ───────────────────────────────────────────────────────────

app.get('/api/notificaciones/tipos', validarToken, (req, res) => {
    db.query('SELECT * FROM Notificaciones ORDER BY Codigo_Notificaciones ASC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.get('/api/notificaciones/usuario/:id', validarToken, (req, res) => {
    const idUsuario = req.params.id;
    const notificaciones = [];

    const sqlServicios = `SELECT s.ID_Servicio, s.Movil_Nombre, s.Etapa, s.Fecha, s.Descripcion, u.Nombre AS Nombre_Cliente
                          FROM Servicio s
                          LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario
                          WHERE s.ID_Usuario = ?
                          ORDER BY s.ID_Servicio DESC LIMIT 10`;
    db.query(sqlServicios, [idUsuario], (err, servicios) => {
        if (err) return res.status(500).json(err);
        servicios.forEach(s => {
            let tipo = 'Servicio en proceso', icono = '⏳';
            if (s.Etapa >= 100) { tipo = 'Su celular está listo'; icono = '✅'; }
            else if (s.Etapa >= 50) { tipo = 'Su celular está siendo reparado'; icono = '🔧'; }
            notificaciones.push({
                id: `srv-${s.ID_Servicio}`, tipo, icono,
                titulo: s.Movil_Nombre, descripcion: s.Descripcion,
                fecha: s.Fecha, etapa: s.Etapa, leido: s.Etapa === 100
            });
        });

        const sqlMensajes = `SELECT m.Mensaje, m.Fecha_Mensaje, m.Codigo_Chat, u.Nombre AS De_Usuario
                              FROM Mensajes m
                              LEFT JOIN Usuario u ON m.ID_Usuario = u.ID_Usuario
                              LEFT JOIN Chat c ON m.Codigo_Chat = c.Codigo_Chat
                              WHERE c.ID_Usuario = ? AND m.ID_Usuario != ? AND m.Estado = 0
                              ORDER BY m.Codigo_Mensaje DESC LIMIT 10`;
        db.query(sqlMensajes, [idUsuario, idUsuario], (err2, mensajes) => {
            if (err2) return res.status(500).json(err2);
            mensajes.forEach(m => {
                notificaciones.push({
                    id: `msg-${m.Codigo_Chat}-${m.De_Usuario}`,
                    tipo: 'Nuevo Mensaje', icono: '💬',
                    titulo: `Mensaje de ${m.De_Usuario}`,
                    descripcion: m.Mensaje, fecha: m.Fecha_Mensaje,
                    leido: false, chatId: m.Codigo_Chat
                });
            });
            notificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            res.json(notificaciones);
        });
    });
});

// Notificaciones del técnico: mensajes sin leer de todos sus chats
app.get('/api/notificaciones/tecnico', validarToken, (req, res) => {
    const notificaciones = [];
    const sqlMensajes = `SELECT m.Mensaje, m.Fecha_Mensaje, m.Codigo_Chat, u.Nombre AS De_Usuario,
                                s.Movil_Nombre
                          FROM Mensajes m
                          LEFT JOIN Usuario u ON m.ID_Usuario = u.ID_Usuario
                          LEFT JOIN Chat c ON m.Codigo_Chat = c.Codigo_Chat
                          LEFT JOIN Servicio s ON c.ID_Servicio = s.ID_Servicio
                          WHERE m.Estado = 0 AND u.Codigo_Rol = 2
                          ORDER BY m.Codigo_Mensaje DESC LIMIT 20`;
    db.query(sqlMensajes, (err, mensajes) => {
        if (err) return res.status(500).json(err);
        mensajes.forEach(m => {
            notificaciones.push({
                id: `tech-msg-${m.Codigo_Chat}`,
                tipo: 'Nuevo Mensaje de Cliente', icono: '💬',
                titulo: m.De_Usuario,
                descripcion: m.Mensaje,
                fecha: m.Fecha_Mensaje,
                leido: false, chatId: m.Codigo_Chat,
                movil: m.Movil_Nombre
            });
        });

        const sqlServicios = `SELECT s.ID_Servicio, s.Movil_Nombre, s.Fecha, s.Descripcion, u.Nombre AS Nombre_Cliente
                              FROM Servicio s
                              LEFT JOIN Usuario u ON s.ID_Usuario = u.ID_Usuario
                              WHERE s.Etapa < 100
                              ORDER BY s.Fecha DESC LIMIT 10`;
        db.query(sqlServicios, (err2, servicios) => {
            if (err2) return res.status(500).json(err2);
            servicios.forEach(s => {
                notificaciones.push({
                    id: `tech-srv-${s.ID_Servicio}`, tipo: 'Servicio Pendiente', icono: '🔧',
                    titulo: s.Movil_Nombre, descripcion: `Cliente: ${s.Nombre_Cliente} — ${s.Descripcion}`,
                    fecha: s.Fecha, leido: false
                });
            });
            notificaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            res.json(notificaciones);
        });
    });
});

// Notificaciones del admin: resumen general del sistema
app.get('/api/notificaciones/admin', validarToken, soloAdmin, (req, res) => {
    const notificaciones = [];
    db.query(`SELECT COUNT(*) AS total, SUM(Etapa < 100) AS pendientes, SUM(Etapa >= 100) AS completados FROM Servicio`, (err, r) => {
        if (err) return res.status(500).json(err);
        const stat = r[0];
        notificaciones.push({
            id: 'admin-srv-stat', tipo: 'Resumen del Sistema', icono: '📊',
            titulo: `${stat.total} servicios registrados`,
            descripcion: `${stat.pendientes} en proceso · ${stat.completados} completados`,
            fecha: new Date().toISOString(), leido: false
        });

        db.query(`SELECT COUNT(*) AS sinLeer FROM Mensajes WHERE Estado = 0`, (err2, r2) => {
            if (err2) return res.status(500).json(err2);
            if (r2[0].sinLeer > 0) {
                notificaciones.push({
                    id: 'admin-msg-stat', tipo: 'Mensajes Sin Responder', icono: '💬',
                    titulo: `${r2[0].sinLeer} mensajes pendientes`,
                    descripcion: 'Hay mensajes en el chat que no han sido respondidos',
                    fecha: new Date().toISOString(), leido: false
                });
            }

            db.query(`SELECT u.Nombre, u.ID_Usuario FROM Usuario u WHERE u.Codigo_Rol = 2 ORDER BY u.ID_Usuario DESC LIMIT 3`, (err3, usuarios) => {
                if (err3) return res.status(500).json(err3);
                usuarios.forEach(u => {
                    notificaciones.push({
                        id: `admin-user-${u.ID_Usuario}`, tipo: 'Cliente Registrado', icono: '👤',
                        titulo: u.Nombre, descripcion: `Documento: ${u.ID_Usuario}`,
                        fecha: new Date().toISOString(), leido: true
                    });
                });
                res.json(notificaciones);
            });
        });
    });
});

// ─── CATÁLOGO / PRODUCTOS ─────────────────────────────────────────────────────

// Solo productos activos con stock (vista cliente)
app.get('/api/productos/catalogo', validarToken, (req, res) => {
    const sql = `SELECT p.*, c.Nombre_Categoria
                 FROM Producto p
                 LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
                 WHERE p.Activo_Catalogo = 1 AND p.Cantidad > 0
                 ORDER BY c.Nombre_Categoria, p.Nombre ASC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Todos los productos (admin)
app.get('/api/productos/listar', validarToken, soloAdmin, (req, res) => {
    const sql = `SELECT p.*, c.Nombre_Categoria
                 FROM Producto p
                 LEFT JOIN Categoria c ON p.ID_Categoria = c.ID_Categoria
                 ORDER BY p.Activo_Catalogo DESC, c.Nombre_Categoria, p.Nombre ASC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar producto
app.post('/api/productos/agregar', validarToken, soloAdmin, (req, res) => {
    const { Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria } = req.body;
    const sql = `INSERT INTO Producto (Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen, Activo_Catalogo, ID_Categoria)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Imagen || '', Activo_Catalogo || 1, ID_Categoria], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Producto creado" });
    });
});

// Actualizar producto
app.put('/api/productos/actualizar', validarToken, soloAdmin, (req, res) => {
    const { Codigo_Producto, Cantidad, Precio, Nombre, Descripcion, Activo_Catalogo, ID_Categoria } = req.body;
    const sql = `UPDATE Producto SET Cantidad=?, Precio=?, Nombre=?, Descripcion=?, Activo_Catalogo=?, ID_Categoria=?
                 WHERE Codigo_Producto=?`;
    db.query(sql, [Cantidad, Precio, Nombre, Descripcion, Activo_Catalogo, ID_Categoria, Codigo_Producto], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Producto actualizado" });
    });
});

// Eliminar producto
app.delete('/api/productos/eliminar/:codigo', validarToken, soloAdmin, (req, res) => {
    db.query('DELETE FROM Producto WHERE Codigo_Producto = ?', [req.params.codigo], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Producto eliminado" });
    });
});

// Listar categorías
app.get('/api/categorias', validarToken, (req, res) => {
    db.query('SELECT * FROM Categoria ORDER BY Nombre_Categoria ASC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Preguntas sobre productos
app.get('/api/preguntas/listar', validarToken, soloStaff, (req, res) => {
    const sql = `SELECT pr.*, u.Nombre AS Nombre_Usuario, p.Nombre AS Nombre_Producto
                 FROM Pregunta pr
                 LEFT JOIN Usuario u ON pr.ID_Usuario = u.ID_Usuario
                 LEFT JOIN Producto p ON pr.Codigo_Producto = p.Codigo_Producto
                 ORDER BY pr.Fecha DESC`;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/preguntas/hacer', validarToken, (req, res) => {
    const { Codigo_Producto, Pregunta } = req.body;
    const Fecha = new Date().toISOString().split('T')[0];
    const sql = `INSERT INTO Pregunta (ID_Usuario, Codigo_Producto, Pregunta, Fecha) VALUES (?, ?, ?, ?)`;
    db.query(sql, [req.userId, Codigo_Producto, Pregunta, Fecha], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Pregunta enviada" });
    });
});

app.listen(3000, () => console.log("Servidor ejecutándose en puerto 3000"));
