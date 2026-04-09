const express = require('express');
const mysql = require('mysql2');
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('./swagger.json');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Swagger
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

// Conexión a la base de datos
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
    console.log('Conectado a la base de datos celuaccel');
});

global.db = db;

// Importar todas las rutas centralizadas
const routes = require('./routes/Routes');
app.use('/api', routes);

// Arrancar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});
