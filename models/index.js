const sequelize = require('../config/database');
const Medico = require('./medico');
const Paciente = require('./paciente');
const Medicamento = require('./medicamento');
const Receta = require('./receta');
const RecetaItem = require('./receta_item');
const MedicoPaciente = require('./medico_paciente');

// Relaciones 1 a Muchos
Medico.hasMany(Receta, { foreignKey: 'medico_id' });
Receta.belongsTo(Medico, { foreignKey: 'medico_id' });

Paciente.hasMany(Receta, { foreignKey: 'paciente_id' });
Receta.belongsTo(Paciente, { foreignKey: 'paciente_id' });

Receta.hasMany(RecetaItem, { foreignKey: 'receta_id' });
RecetaItem.belongsTo(Receta, { foreignKey: 'receta_id' });

Medicamento.hasMany(RecetaItem, { foreignKey: 'medicamento_id' });
RecetaItem.belongsTo(Medicamento, { foreignKey: 'medicamento_id' });

// Relación Muchos a Muchos: Medico <-> Paciente
Medico.belongsToMany(Paciente, { through: MedicoPaciente, foreignKey: 'medico_id' });
Paciente.belongsToMany(Medico, { through: MedicoPaciente, foreignKey: 'paciente_id' });


module.exports = { sequelize, Medico, Paciente, Medicamento, Receta, RecetaItem, MedicoPaciente };
