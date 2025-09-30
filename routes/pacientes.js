const express = require('express');
const router = express.Router();
const { crearPaciente, listarPacientes } = require('../controllers/pacientesController');

router.post('/', crearPaciente);
router.get('/', listarPacientes);

module.exports = router;
