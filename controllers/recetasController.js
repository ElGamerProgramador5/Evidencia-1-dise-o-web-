const { Receta, RecetaItem, Medicamento, Medico, Paciente } = require('../models');

async function crearReceta(req, res) {
  const { medico_id, paciente_id, motivo, instrucciones_generales, items } = req.body;
  const receta = await Receta.create({ medico_id, paciente_id, motivo, instrucciones_generales });
  const itemsInsert = items.map(i => ({
    receta_id: receta.id,
    medicamento_id: i.medicamento_id,
    dosis: i.dosis,
    posologia: i.posologia,
    observaciones: i.observaciones
  }));
  await RecetaItem.bulkCreate(itemsInsert);
  res.status(201).json({ id: receta.id });
}

async function imprimirReceta(req, res) {
  const id = req.params.id;
  const receta = await Receta.findByPk(id);
  const medico = await Medico.findByPk(receta.medico_id);
  const paciente = await Paciente.findByPk(receta.paciente_id);
  const items = await RecetaItem.findAll({ where: { receta_id: id }, include: [Medicamento] });

  res.render('print_receta', { receta, medico, paciente, items });
}

module.exports = { crearReceta, imprimirReceta };
