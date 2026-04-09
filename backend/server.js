const express = require('express');
const cors = require('cors');
const Routes = require('./routes/Routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', Routes);

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});
