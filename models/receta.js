const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Receta = sequelize.define('Receta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  medico_id: { type: DataTypes.INTEGER, allowNull: false },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  motivo: { type: DataTypes.TEXT },
  instrucciones_generales: { type: DataTypes.TEXT }
}, { tableName: 'recetas', timestamps: false });

module.exports = Receta;
