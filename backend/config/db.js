const mysql = require("mysql2");

const db = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'celuaccel',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos celuaccel');
    connection.release(); 
});

module.exports = db;

