const { MedicoPaciente, Paciente, Receta, sequelize } = require('../models');

async function getMisPacientes(req, res) {
    try {
        const medicoId = req.user.id;
        const pacientes = await Paciente.findAll({
            include: [{
                model: MedicoPaciente,
                where: { medico_id: medicoId },
                attributes: []
            }],
            attributes: ['id', 'nombre', 'fecha_nacimiento', 'genero'],
            order: [['nombre', 'ASC']]
        });
        res.json(pacientes);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function darDeAltaPaciente(req, res) {
    try {
        const medicoId = req.user.id;
        const pacienteId = req.params.id;

        await MedicoPaciente.destroy({
            where: {
                medico_id: medicoId,
                paciente_id: pacienteId
            }
        });
        res.status(200).json({ message: 'Paciente dado de alta correctamente.' });
    } catch (error) {
        console.error('Error al dar de alta al paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = { getMisPacientes, darDeAltaPaciente };