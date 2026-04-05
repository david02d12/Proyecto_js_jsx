const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const chatRoutes = require('./routes/chatRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api', chatRoutes);
app.use('/api', catalogoRoutes);
app.use('/api/notificaciones', notificacionRoutes);

module.exports = app;
