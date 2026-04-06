const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

// Base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'servicios' 
});

// Conexión
db.connect(err => {
    if (err) console.error("Error MySQL:", err.message);
});

// Clave secreta
const SECRET_KEY = "mi_clave";

// Middleware
const validarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) return res.status(401).json({ mensaje: "Token faltante" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ mensaje: "Token inválido" });
        req.userId = decoded.id;
        next();
    });
};

// Registro usuario
app.post('/api/registro', async (req, res) => { // SE AGREGÓ 'async'
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave } = req.body;
    
    //Contraseña encriptada
    const saltRounds = 10;
    const hashedClave = await bcrypt.hash(Clave, saltRounds);

    const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Admin')`;
    db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, hashedClave], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario creado" });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";


    const sql = "SELECT * FROM Usuario WHERE TRIM(ID_Usuario) = ?";
    db.query(sql, [user], async (err, results) => {
        if (err) return res.status(500).json(err);
        
        if (results.length > 0) {
            const match = await bcrypt.compare(password, results[0].Clave);
            
            if (match) {
                const token = jwt.sign({ id: results[0].ID_Usuario }, SECRET_KEY, { expiresIn: '2h' });
                res.json({ auth: true, token, user: results[0].ID_Usuario });
            } else {
                res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
            }
        } else {
            res.status(401).json({ auth: false, message: "Credenciales incorrectas" });
        }
    });
});

// Listar Servicios
app.get('/api/servicios/listar', validarToken, (req, res) => {
    db.query('SELECT * FROM Servicio', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar Servicios
app.post('/api/servicios/agregar', validarToken, (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa } = req.body;
    const sql = `INSERT INTO Servicio (Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Guardado" });
    });
});

// Actualizar Servicios
app.put('/api/servicios/actualizar', validarToken, (req, res) => {
    const { Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio } = req.body;
    const sql = `UPDATE Servicio SET Descripcion=?, ID_Usuario=?, Precio=?, Movil_Nombre=?, Movil_Especificacion=?, Fecha=?, Etapa=? WHERE ID_Servicio=?`;
    db.query(sql, [Descripcion, ID_Usuario, Precio, Movil_Nombre, Movil_Especificacion, Fecha, Etapa, ID_Servicio], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Actualizado" });
    });
});

// Eliminar Servicios
app.delete('/api/servicios/eliminar/:id', validarToken, (req, res) => {
    db.query('DELETE FROM Servicio WHERE ID_Servicio = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Eliminado" });
    });
});


// Listar Roles
app.get('/api/roles/listar', validarToken, (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar Rol
app.post('/api/roles/agregar', validarToken, (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;
    const sql = `INSERT INTO Roles (Codigo_Rol, Descripcion_Rol) VALUES (?, ?)`;
    db.query(sql, [Codigo_Rol, Descripcion_Rol], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Rol guardado" });
    });
});

// Actualizar Rol
app.put('/api/roles/actualizar', validarToken, (req, res) => {
    const { Codigo_Rol, Descripcion_Rol } = req.body;
    const sql = `UPDATE Roles SET Descripcion_Rol=? WHERE Codigo_Rol=?`;
    db.query(sql, [Descripcion_Rol, Codigo_Rol], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol actualizado" });
    });
});

// Eliminar Rol
app.delete('/api/roles/eliminar/:id', validarToken, (req, res) => {
    db.query('DELETE FROM Roles WHERE Codigo_Rol = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Rol eliminado" });
    });
});



// Listar Historial
app.get('/api/historial/listar', validarToken, (req, res) => {
    db.query('SELECT * FROM Historial_Servicios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar Historial
app.post('/api/historial/agregar', validarToken, (req, res) => {
    const { ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado } = req.body;
    const sql = `INSERT INTO Historial_Servicios (ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ID_Historial, ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Historial registrado" });
    });
});

// Actualizar Historial
app.put('/api/historial/actualizar', validarToken, (req, res) => {
    const { ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial } = req.body;
    const sql = `UPDATE Historial_Servicios SET ID_Servicio=?, Fecha_Evento=?, Descripcion_Evento=?, Estado=? WHERE ID_Historial=?`;
    db.query(sql, [ID_Servicio, Fecha_Evento, Descripcion_Evento, Estado, ID_Historial], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Historial actualizado" });
    });
});

// Eliminar Historial
app.delete('/api/historial/eliminar/:id', validarToken, (req, res) => {
    db.query('DELETE FROM Historial_Servicios WHERE ID_Historial = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Historial eliminado" });
    });
});



// Listar Tipos de Documento
app.get('/api/tipodocumento/listar', validarToken, (req, res) => {
    db.query('SELECT * FROM Tipo_Documento', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Agregar Tipo de Documento
app.post('/api/tipodocumento/agregar', validarToken, (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;
    const sql = `INSERT INTO Tipo_Documento (Codigo_Documento, Nombre_Documento) VALUES (?, ?)`;
    db.query(sql, [Codigo_Documento, Nombre_Documento], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Tipo de documento guardado" });
    });
});

// Actualizar Tipo de Documento
app.put('/api/tipodocumento/actualizar', validarToken, (req, res) => {
    const { Codigo_Documento, Nombre_Documento } = req.body;
    const sql = `UPDATE Tipo_Documento SET Nombre_Documento=? WHERE Codigo_Documento=?`;
    db.query(sql, [Nombre_Documento, Codigo_Documento], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Tipo de documento actualizado" });
    });
});

// Eliminar Tipo de Documento
app.delete('/api/tipodocumento/eliminar/:id', validarToken, (req, res) => {
    db.query('DELETE FROM Tipo_Documento WHERE Codigo_Documento = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Tipo de documento eliminado" });
    });
});

app.listen(3000, () => console.log("Servidor ejecutándose en puerto 3000"));
