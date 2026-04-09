const mysql = require('mysql2');

//AQUI VA LA INFORMACION DE LA BASE DE DATOS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'servicios' 
});

db.connect(err => {
    if (err) console.error("Error MySQL:", err.message);
});

module.exports = db;