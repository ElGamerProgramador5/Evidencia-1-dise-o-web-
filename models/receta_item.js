const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecetaItem = sequelize.define('RecetaItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  receta_id: { type: DataTypes.INTEGER, allowNull: false },
  medicamento_id: { type: DataTypes.INTEGER, allowNull: false },
  dosis: { type: DataTypes.STRING, allowNull: false },
  posologia: { type: DataTypes.TEXT, allowNull: false },
  observaciones: { type: DataTypes.TEXT }
}, { tableName: 'receta_items', timestamps: false });

module.exports = RecetaItem;
