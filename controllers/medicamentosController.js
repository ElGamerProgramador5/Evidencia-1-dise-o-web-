const { Medicamento } = require('../models');

async function getAllMedicamentos(req, res) {
    try {
        const medicamentos = await Medicamento.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(medicamentos);
    } catch (error) {
        console.error('Error al obtener medicamentos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = { getAllMedicamentos };