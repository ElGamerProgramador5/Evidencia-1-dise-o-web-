const { Paciente } = require('../models');

async function crearPaciente(req, res) {
  const { nombre, fecha_nacimiento, genero } = req.body;
  const paciente = await Paciente.create({ nombre, fecha_nacimiento, genero });
  res.status(201).json(paciente);
}

async function listarPacientes(req, res) {
  const pacientes = await Paciente.findAll();
  res.json(pacientes);
}

module.exports = { crearPaciente, listarPacientes };
