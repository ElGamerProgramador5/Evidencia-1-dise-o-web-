require('dotenv').config();
const { sequelize, Medico, Paciente, Medicamento, Receta, RecetaItem, MedicoPaciente } = require('./models');

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('¡Éxito! La conexión a la base de datos se ha establecido correctamente.');
    console.log('Todos los modelos fueron cargados sin errores de asociación.');
  } catch (error) {
    console.error('Error al conectar o cargar los modelos:', error);
  } finally {
    await sequelize.close();
  }
};

testDatabaseConnection();
