const { Receta, RecetaItem, Medicamento, Paciente, Medico, sequelize } = require('../models');

async function createReceta(req, res) {
    const { pacienteId, motivo, medicamentos } = req.body;
    const medicoId = req.user.id;

    const t = await sequelize.transaction();

    try {
        // 1. Crear la receta
        const receta = await Receta.create({
            medico_id: medicoId,
            paciente_id: pacienteId,
            motivo: motivo,
            fecha: new Date()
        }, { transaction: t });

        // 2. Crear o encontrar los medicamentos y los items de la receta
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

        res.status(201).json({ id: receta.id, message: 'Receta creada con éxito' });

    } catch (error) {
        await t.rollback();
        console.error('Error al crear la receta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Necesitarás esta función para la impresión, la adapto de tu print.js
async function getRecetaForPrint(req, res) {
    try {
        const recetaId = req.params.id;
        const medicoId = req.user.id; // Asegurarse que el médico solo vea sus recetas

        const receta = await Receta.findOne({
            where: { id: recetaId, medico_id: medicoId },
            include: [
                { model: Medico, attributes: ['nombre'] },
                { model: Paciente, attributes: ['nombre'] },
                { 
                    model: RecetaItem,
                    include: [{ model: Medicamento, attributes: ['nombre'] }]
                }
            ]
        });

        if (!receta) {
            return res.status(404).json({ message: 'Receta no encontrada o no tienes permiso para verla.' });
        }

        res.json(receta);
    } catch (error) {
        console.error('Error al obtener datos para imprimir:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = { createReceta, getRecetaForPrint };