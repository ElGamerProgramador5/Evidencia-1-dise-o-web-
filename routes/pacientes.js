const express = require('express');
const router = express.Router();
const { getMisPacientes, darDeAltaPaciente } = require('../controllers/pacientesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Aplicar autenticación a todas las rutas de pacientes
router.use(authenticateToken);

// GET /pacientes - Obtiene la lista de pacientes del médico logueado
router.get('/', getMisPacientes);

// DELETE /pacientes/:id - Desvincula (da de alta) a un paciente del médico
router.delete('/:id', darDeAltaPaciente);

module.exports = router;