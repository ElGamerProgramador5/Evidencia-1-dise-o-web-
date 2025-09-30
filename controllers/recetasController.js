const { sequelize, Receta, RecetaItem, Medicamento, Medico, Paciente } = require('../models');

async function crearReceta(req, res) {
  const { pacienteId, motivo, medicamentos } = req.body;
  const medicoId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const receta = await Receta.create({ 
      medico_id: medicoId, 
      paciente_id: pacienteId, 
      motivo 
    }, { transaction: t });

    for (const med of medicamentos) {
      const [medicamento] = await Medicamento.findOrCreate({
        where: { nombre: med.nombre },
        defaults: { nombre: med.nombre },
        transaction: t
      });

      await RecetaItem.create({
        receta_id: receta.id,
        medicamento_id: medicamento.id,
        dosis: med.dosis,
        posologia: med.posologia
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(receta);

  } catch (error) {
    await t.rollback();
    console.error('Error al crear receta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

async function imprimirReceta(req, res) {
  try {
    const id = req.params.id;
    const receta = await Receta.findByPk(id, {
      include: [
        { model: Medico },
        { model: Paciente },
        {
          model: RecetaItem,
          include: [{ model: Medicamento }]
        }
      ]
    });

    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    // Adicionalmente, verificar que el médico que solicita la receta es el mismo que la creó
    if (receta.medico_id !== req.user.id) {
        return res.status(403).json({ message: 'No autorizado para ver esta receta' });
    }

    res.json(receta);
  } catch (error) {
    console.error('Error al obtener receta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { crearReceta, imprimirReceta };
