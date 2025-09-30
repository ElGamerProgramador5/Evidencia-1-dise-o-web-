const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicoPaciente = sequelize.define('MedicoPaciente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  medico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'medicos',
      key: 'id'
    }
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes',
      key: 'id'
    }
  }
}, {
  tableName: 'medico_paciente',
  timestamps: false
});

module.exports = MedicoPaciente;
