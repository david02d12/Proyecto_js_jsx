const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerDocumentation = require('./swagger.json');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Swagger
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

// La conexión a la base de datos ya es manejada en config/db.js

// Importar todas las rutas centralizadas
const routes = require('./routes/Routes');
app.use('/api', routes);

// Arrancar servidor
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});