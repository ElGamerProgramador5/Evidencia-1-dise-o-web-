require('dotenv').config();

const { Receta, Medico, Paciente, RecetaItem, Medicamento } = require('./models'); // si quieres usar datos


console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
const express = require('express');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rutas


// Ruta principal
app.get('/', async (req, res) => {
  try {
    const receta = await Receta.findOne({
  include: [
    Medico,
    Paciente,
    { 
      model: RecetaItem, 
      include: [Medicamento]  // <-- incluir Medicamento dentro de cada item
    }
  ]
});

    res.render('print_receta', {
      receta,
      medico: receta.Medico,
      paciente: receta.Paciente,
      items: receta.RecetaItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la receta');
  }
});



app.use('/auth', require('./routes/auth'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/recetas', require('./routes/recetas'));

// Levantar servidor
const PORT = process.env.PORT || 3000;
sequelize.authenticate().then(() => {
  console.log('DB conectada');
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}).catch(err => console.error(err));
