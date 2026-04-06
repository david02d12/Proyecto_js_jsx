const express = require('express');
const cors = require('cors');
const app = express();
const productoRoutes = require('./routes/ProductoRoutes');

app.use(cors());
app.use(express.json());


// Rutas Producto
app.use('/Productos', ProductoRoutes);
// Importar las rutas de categorías
const categoriaRoutes = require('./routes/CategoriaRoutes');

// Usar las rutas
app.use('/categorias', categoriaRoutes);

module.exports = app;


