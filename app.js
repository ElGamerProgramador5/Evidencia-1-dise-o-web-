require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/auth', require('./routes/auth'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/recetas',require('./routes/recetas'));
app.use('/medicamentos', require('./routes/medicamentos'));

// Ruta principal que sirve el login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
sequelize.authenticate().then(() => {
  console.log('DB conectada');
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}).catch(err => console.error(err));
