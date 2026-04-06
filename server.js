const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'celuaccel' 
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la DB:', err);
        return;
    }
    console.log(' Conectado a la base de datos CeluAccel');
});

global.db = db;

const productoRoutes = require('./routes/ProductoRoutes');
app.use('/productos', productoRoutes);
app.listen(3000, () => {
    console.log(" Servidor corriendo en puerto 3000");
});