const mysql = require('mysql2');

//AQUI VA LA INFORMACION DE LA BASE DE DATOS

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'celuaccel' 
});

db.connect(err => {
    if (err) {
        console.error("Error MySQL:", err.message);
    } else {
        console.log("Conectado a la base de datos celuaccel");
    }
});

module.exports = db;
