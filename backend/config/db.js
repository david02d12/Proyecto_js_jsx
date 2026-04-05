const mysql = require('mysql2');
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
        console.log("Conectado a MySQL correctamente.");
    }
});
const SECRET_KEY = "mi_clave";

module.exports = {
    db,
    SECRET_KEY
};
