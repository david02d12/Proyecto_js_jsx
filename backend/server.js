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
    database: 'servicios' 
});

// Conexión
db.connect(err => {
    if (err) console.error("Error MySQL:", err.message);
});

// Clave secreta
const SECRET_KEY = "mi_clave";

//Middleware
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
app.post('/api/registro', (req, res) => {
    const { ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave } = req.body;
    const sql = `INSERT INTO Usuario (ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave, Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Admin')`;
    db.query(sql, [ID_Usuario, Codigo_Documento, Nombre, Fecha_Nacimiento, Direccion, Telefono, Correo, Clave], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuario creado" });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const user = req.body.user ? req.body.user.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    const sql = "SELECT * FROM Usuario WHERE TRIM(ID_Usuario) = ? AND TRIM(Clave) = ?";
    db.query(sql, [user, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            const token = jwt.sign({ id: results[0].ID_Usuario }, SECRET_KEY, { expiresIn: '2h' });
            res.json({ auth: true, token, user: results[0].ID_Usuario });
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

app.listen(3000, () => console.log("Servidor ejecutándose en puerto 3000"));