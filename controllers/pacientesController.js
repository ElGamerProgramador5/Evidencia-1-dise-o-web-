const { Paciente, Medico } = require('../models');

async function crearPaciente(req, res) {
  const { nombre, fecha_nacimiento, genero } = req.body;
  // TODO: Asociar el paciente al médico logueado
  const paciente = await Paciente.create({ nombre, fecha_nacimiento, genero });
  res.status(201).json(paciente);
}

async function listarPacientes(req, res) {
  try {
    const medico = await Medico.findByPk(req.user.id, {
      include: [Paciente]
    });

    if (!medico) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }

    res.json(medico.Pacientes);
  } catch (error) {
    console.error('Error al listar pacientes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { crearPaciente, listarPacientes };
