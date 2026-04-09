const express = require('express');
const cors = require('cors');
const Routes = require('./routes/Routes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json'); // archivo generado por swagger.js

const app = express();

app.use(express.json());
app.use(cors());

// Rutas de tu API
app.use('/api', Routes);

// Ruta para la documentación
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});
